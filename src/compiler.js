'use strict';

const toIdentifier = name => {
  const id = name.replace(/[^0-9A-Za-z]/g, '');
  return id.charAt(0).toUpperCase() + id.slice(1);
};

const toTags = tags =>
  Object.entries(tags).map(([Key, Value]) => ({ Key, Value }));

const toEnvironment = tags =>
  Object.entries(tags).map(([Name, Value]) => ({ Name, Value }));

const compileCluster = config => ({
  Resources: {
    FargateTasksCluster: {
      Type: 'AWS::ECS::Cluster',
      Properties: {
        CapacityProviders: [
          'FARGATE',
          'FARGATE_SPOT',
          config.autoScalingGroupCapacityProviderName,
        ].filter(Boolean),
        Tags: toTags(config.tags),
      },
    },
    FargateTasksLogGroup: {
      Type: 'AWS::Logs::LogGroup',
      Properties: {
        LogGroupName: config.logGroupName,
        Tags: toTags(config.tags),
      },
    },
  },
  Outputs: {},
});

const compileIamRoles = config => ({
  Resources: {
    FargateIamExecutionRole: {
      Type: 'AWS::IAM::Role',
      Properties: {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                Service: ['ecs-tasks.amazonaws.com', 'events.amazonaws.com'],
              },
              Action: ['sts:AssumeRole'],
            },
          ],
        },
        ManagedPolicyArns: [
          'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
          'arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceEventsRole',
        ],
        Tags: toTags(config.tags),
      },
    },
    FargateIamTaskRole: {
      Type: 'AWS::IAM::Role',
      Properties: {
        AssumeRolePolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                Service: ['ecs-tasks.amazonaws.com'],
              },
              Action: ['sts:AssumeRole'],
            },
          ],
        },
        Policies:
          config.iamRoleStatements.length > 0
            ? [
                {
                  PolicyName: 'FargateTaskPolicy',
                  PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: config.iamRoleStatements,
                  },
                },
              ]
            : [],
        ManagedPolicyArns: config.iamManagedPolicies,
        Tags: toTags(config.tags),
      },
    },
  },
  Outputs: {},
});

const compileTaskDefinition = (images, task) => ({
  Type: 'AWS::ECS::TaskDefinition',
  Properties: {
    ContainerDefinitions: [
      {
        Name: task.name,
        Image: images[task.name],
        Environment: toEnvironment(task.environment),
        EntryPoint: task.entryPoint,
        Command: task.command,
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-region': { 'Fn::Sub': '${AWS::Region}' },
            'awslogs-group': {
              'Fn::Sub': '${FargateTasksLogGroup}',
            },
            'awslogs-stream-prefix': 'fargate',
          },
        },
      },
    ],
    Family: task.name,
    NetworkMode: task.autoScalingGroupCapacityProviderName
      ? 'bridge'
      : 'awsvpc',
    ExecutionRoleArn: task.executionRoleArn || {
      'Fn::Sub': '${FargateIamExecutionRole}',
    },
    TaskRoleArn: task.taskRoleArn || {
      'Fn::Sub': '${FargateIamTaskRole}',
    },
    RequiresCompatibilities: [
      task.autoScalingGroupCapacityProviderName ? 'EC2' : 'FARGATE',
    ],
    Memory: task.memory,
    Cpu: task.cpu,
    Tags: toTags(task.tags),
  },
});

const compileScheduledTask = (identifier, task) => ({
  Type: 'AWS::Events::Rule',
  Properties: {
    ScheduleExpression: task.schedule,
    Targets: [
      {
        Id: identifier,
        Arn: {
          'Fn::GetAtt': ['FargateTasksCluster', 'Arn'],
        },
        RoleArn: {
          'Fn::GetAtt': ['FargateIamExecutionRole', 'Arn'],
        },
        EcsParameters: {
          TaskDefinitionArn: {
            'Fn::Sub': '${' + identifier + 'Task}',
          },
          TaskCount: 1,
          LaunchType: task.autoScalingGroupCapacityProviderName
            ? 'EC2'
            : 'FARGATE',
          NetworkConfiguration: task.autoScalingGroupCapacityProviderName
            ? undefined
            : {
                AwsVpcConfiguration: {
                  AssignPublicIp: task.vpc.assignPublicIp
                    ? 'ENABLED'
                    : 'DISABLED',
                  SecurityGroups: task.vpc.securityGroupIds,
                  Subnets: task.vpc.subnetIds,
                },
              },
        },
      },
    ],
  },
});

const compileService = (identifier, task) => ({
  Type: 'AWS::ECS::Service',
  Properties: {
    Cluster: { 'Fn::Sub': '${FargateTasksCluster}' },
    ServiceName: task.name,
    CapacityProviderStrategy: [
      {
        CapacityProvider: task.autoScalingGroupCapacityProviderName
          ? task.autoScalingGroupCapacityProviderName
          : task.service.spot
          ? 'FARGATE_SPOT'
          : 'FARGATE',
        Weight: 1,
      },
    ],
    DesiredCount: task.service.desiredCount,
    DeploymentConfiguration: {
      MaximumPercent: task.service.maximumPercent,
      MinimumHealthyPercent: task.service.minimumHealthyPercent,
    },
    TaskDefinition: { 'Fn::Sub': '${' + identifier + 'Task}' },
    NetworkConfiguration: task.autoScalingGroupCapacityProviderName
      ? undefined
      : {
          AwsvpcConfiguration: {
            AssignPublicIp: task.vpc.assignPublicIp ? 'ENABLED' : 'DISABLED',
            SecurityGroups: task.vpc.securityGroupIds,
            Subnets: task.vpc.subnetIds,
          },
        },
    PropagateTags: 'TASK_DEFINITION',
    Tags: toTags(task.tags),
  },
});

const compileTask = (images, task) => {
  const identifier = toIdentifier(task.name);

  if (task.schedule) {
    return {
      Resources: {
        [identifier + 'Task']: compileTaskDefinition(images, task),
        [identifier + 'ScheduledTask']: compileScheduledTask(identifier, task),
      },
      Outputs: {
        [identifier + 'TaskArn']: {
          Value: { Ref: identifier + 'Task' },
        },
        [identifier + 'ScheduledTaskArn']: {
          Value: {
            'Fn::GetAtt': [identifier + 'ScheduledTask', 'Arn'],
          },
        },
      },
    };
  }

  return {
    Resources: {
      [identifier + 'Task']: compileTaskDefinition(images, task),
      [identifier + 'Service']: compileService(identifier, task),
    },
    Outputs: {
      [identifier + 'TaskArn']: {
        Value: { Ref: identifier + 'Task' },
      },
      [identifier + 'ServiceArn']: {
        Value: { Ref: identifier + 'Service' },
      },
    },
  };
};

module.exports = (images, config) => {
  const cluster = compileCluster(config);
  const iamRoles = compileIamRoles(config);
  const tasks = config.tasks.reduce(({ Resources, Outputs }, task) => {
    const compiled = compileTask(images, task);
    return {
      Resources: { ...Resources, ...compiled.Resources },
      Outputs: { ...Outputs, ...compiled.Outputs },
    };
  }, {});

  return {
    Resources: {
      ...cluster.Resources,
      ...iamRoles.Resources,
      ...tasks.Resources,
    },
    Outputs: {
      ...cluster.Outputs,
      ...iamRoles.Outputs,
      ...tasks.Outputs,
    },
  };
};
