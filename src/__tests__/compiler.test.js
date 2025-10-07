const compile = require('../compiler');

test('single service task', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
      clusterName: undefined,
      containerInsights: undefined,
      memory: '0.5GB',
      cpu: 256,
      architecture: undefined,
      environment: {
        provider: 'variable',
      },
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['sqs:*'],
          Resource: '*',
        },
      ],
      iamManagedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess'],
      vpc: {
        subnetIds: ['subnet-1234', 'subnet-5678'],
        securityGroupIds: ['sg-1234'],
        assignPublicIp: false,
      },
      tags: {
        provider: 'tag',
      },
      cloudFormationResource: {
        task: {},
        container: {},
        additionalContainers: [],
        service: {},
      },
      tasks: [
        {
          name: 'my-task',
          image: 'my-image',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
            assignPublicIp: false,
          },
          command: ['command'],
          entryPoint: ['entrypoint'],
          memory: '0.5GB',
          cpu: 256,
          architecture: undefined,
          environment: {
            task: 'variable',
          },
          tags: {
            task: 'tag',
          },
          service: {
            desiredCount: 1,
            maximumPercent: 200,
            minimumHealthyPercent: 100,
            spot: false,
          },
          cloudFormationResource: {
            task: {},
            container: {},
            additionalContainers: [],
            service: {},
          },
        },
      ],
    }
  );

  expect(compiled).toMatchSnapshot();
});

test('single scheduled task', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
      clusterName: undefined,
      containerInsights: undefined,
      memory: '0.5GB',
      cpu: 256,
      architecture: undefined,
      environment: {
        provider: 'variable',
      },
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['sqs:*'],
          Resource: '*',
        },
      ],
      iamManagedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess'],
      vpc: {
        subnetIds: ['subnet-1234', 'subnet-5678'],
        securityGroupIds: ['sg-1234'],
        assignPublicIp: false,
      },
      tags: {
        provider: 'tag',
      },
      cloudFormationResource: {
        task: {},
        container: {},
        additionalContainers: [],
        service: {},
      },
      tasks: [
        {
          name: 'my-task',
          image: 'my-image',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
            assignPublicIp: false,
          },
          command: ['command'],
          entryPoint: ['entrypoint'],
          memory: '0.5GB',
          cpu: 256,
          architecture: undefined,
          environment: {
            task: 'variable',
          },
          tags: {
            task: 'tag',
          },
          schedule: 'rate(1 minute)',
          cloudFormationResource: {
            task: {},
            container: {},
            additionalContainers: [],
            service: {},
          },
        },
      ],
    }
  );

  expect(compiled).toMatchSnapshot();
});

test('service and scheduled tasks', () => {
  const compiled = compile(
    {
      'my-image-1': 'image-uri-1',
      'my-image-2': 'image-uri-2',
    },
    {
      clusterName: 'my-cluster-name',
      containerInsights: false,
      memory: '0.5GB',
      cpu: 256,
      architecture: undefined,
      environment: {
        provider: 'variable',
      },
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['sqs:*'],
          Resource: '*',
        },
      ],
      iamManagedPolicies: ['arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess'],
      vpc: {
        subnetIds: ['subnet-1234', 'subnet-5678'],
        securityGroupIds: ['sg-1234'],
        assignPublicIp: false,
      },
      tags: {
        provider: 'tag',
      },
      cloudFormationResource: {
        task: {},
        container: {},
        additionalContainers: [],
        service: {},
      },
      tasks: [
        {
          name: 'my-task-1',
          image: 'my-image-1',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
            assignPublicIp: false,
          },
          command: ['command'],
          entryPoint: ['entrypoint'],
          memory: '0.5GB',
          cpu: 256,
          architecture: 'ARM64',
          environment: {
            task: 'variable',
          },
          tags: {
            task: 'tag',
          },
          service: {
            desiredCount: 1,
            maximumPercent: 200,
            minimumHealthyPercent: 100,
            spot: false,
          },
          cloudFormationResource: {
            task: {
              EphemeralStorage: 5,
            },
            container: {
              StopTimeout: 5,
            },
            additionalContainers: [
              {
                Name: 'additional-container-name',
                Image: 'additional-container-image',
              },
            ],
            service: {
              EnableECSManagedTags: 'true',
            },
          },
        },
        {
          name: 'my-task-2',
          image: 'my-image-2',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
            assignPublicIp: false,
          },
          command: ['command'],
          entryPoint: ['entrypoint'],
          memory: '0.5GB',
          cpu: 256,
          architecture: undefined,
          environment: {
            task: 'variable',
          },
          tags: {
            task: 'tag',
          },
          schedule: 'rate(1 minute)',
          cloudFormationResource: {
            task: {},
            container: {},
            additionalContainers: [],
            service: {},
          },
        },
      ],
    }
  );

  expect(compiled).toMatchSnapshot();
});

test('definition without IAM statements/policies present', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
      clusterName: undefined,
      containerInsights: undefined,
      memory: '0.5GB',
      cpu: 256,
      architecture: undefined,
      environment: {},
      iamRoleStatements: [],
      iamManagedPolicies: [],
      vpc: {
        subnetIds: ['subnet-1234', 'subnet-5678'],
        securityGroupIds: ['sg-1234'],
        assignPublicIp: false,
      },
      tags: {},
      cloudFormationResource: {
        task: {},
        container: {},
        additionalContainers: [],
        service: {},
      },
      tasks: [
        {
          name: 'my-task',
          image: 'my-image',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
          },
          command: [],
          entryPoint: [],
          memory: '0.5GB',
          cpu: 256,
          environment: {},
          tags: {},
          service: {
            desiredCount: 1,
          },
          cloudFormationResource: {
            task: {},
            container: {},
            additionalContainers: [],
            service: {},
          },
        },
      ],
    }
  );

  const role = compiled.Resources.FargateIamTaskRole.Properties;
  expect(role.Policies).toEqual([]);
  expect(role.ManagedPolicyArns).toEqual([]);

  expect(compiled).toMatchSnapshot();
});

test('service task with custom IAM roles', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
      memory: '0.5GB',
      cpu: 256,
      vpc: {
        subnetIds: ['subnet-1234', 'subnet-5678'],
        securityGroupIds: ['sg-1234'],
      },
      tags: {},
      environment: {},
      cloudFormationResource: {
        task: {},
        container: {},
        additionalContainers: [],
        service: {},
      },
      iamRoleStatements: [],
      iamManagedPolicies: [],
      tasks: [
        {
          name: 'my-task',
          image: 'my-image',
          executionRoleArn: 'arn:aws:iam::123456789:role/CustomExecutionRole',
          taskRoleArn: 'arn:aws:iam::123456789:role/CustomTaskRole',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
          },
          memory: '0.5GB',
          cpu: 256,
          service: {
            desiredCount: 1,
          },
          tags: {},
          environment: {},
          cloudFormationResource: {
            task: {},
            container: {},
            additionalContainers: [],
            service: {},
          },
        },
      ],
    }
  );

  expect(compiled.Resources.FargateIamExecutionRole).toBeUndefined();
  expect(compiled.Resources.FargateIamTaskRole).toBeUndefined();

  expect(compiled.Resources.MytaskTask.Properties.ExecutionRoleArn).toEqual(
    'arn:aws:iam::123456789:role/CustomExecutionRole'
  );
  expect(compiled.Resources.MytaskTask.Properties.TaskRoleArn).toEqual(
    'arn:aws:iam::123456789:role/CustomTaskRole'
  );
});

test('scheduled task with custom IAM roles', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
      memory: '0.5GB',
      cpu: 256,
      vpc: {
        subnetIds: ['subnet-1234', 'subnet-5678'],
        securityGroupIds: ['sg-1234'],
      },
      tags: {},
      environment: {},
      cloudFormationResource: {
        task: {},
        container: {},
        additionalContainers: [],
        service: {},
      },
      iamRoleStatements: [],
      iamManagedPolicies: [],
      tasks: [
        {
          name: 'my-task',
          image: 'my-image',
          executionRoleArn: 'arn:aws:iam::123456789:role/CustomExecutionRole',
          taskRoleArn: 'arn:aws:iam::123456789:role/CustomTaskRole',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
          },
          memory: '0.5GB',
          cpu: 256,
          schedule: 'rate(1 minute)',
          tags: {},
          environment: {},
          cloudFormationResource: {
            task: {},
            container: {},
            additionalContainers: [],
            service: {},
          },
        },
      ],
    }
  );

  expect(compiled.Resources.FargateIamExecutionRole).toBeUndefined();
  expect(compiled.Resources.FargateIamTaskRole).toBeUndefined();

  expect(compiled.Resources.MytaskTask.Properties.ExecutionRoleArn).toEqual(
    'arn:aws:iam::123456789:role/CustomExecutionRole'
  );
  expect(compiled.Resources.MytaskTask.Properties.TaskRoleArn).toEqual(
    'arn:aws:iam::123456789:role/CustomTaskRole'
  );
  expect(
    compiled.Resources.MytaskScheduledTask.Properties.Targets[0].RoleArn
  ).toEqual('arn:aws:iam::123456789:role/CustomExecutionRole');
});

test('mixed scenario - some tasks with custom roles, some without', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
      memory: '0.5GB',
      cpu: 256,
      vpc: {
        subnetIds: ['subnet-1234', 'subnet-5678'],
        securityGroupIds: ['sg-1234'],
      },
      tags: {},
      environment: {},
      cloudFormationResource: {
        task: {},
        container: {},
        additionalContainers: [],
        service: {},
      },
      iamRoleStatements: [],
      iamManagedPolicies: [],
      tasks: [
        {
          name: 'task-with-role',
          image: 'my-image',
          executionRoleArn: 'arn:aws:iam::123456789:role/CustomExecutionRole',
          taskRoleArn: 'arn:aws:iam::123456789:role/CustomTaskRole',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
          },
          memory: '0.5GB',
          cpu: 256,
          service: {
            desiredCount: 1,
          },
          tags: {},
          environment: {},
          cloudFormationResource: {
            task: {},
            container: {},
            additionalContainers: [],
            service: {},
          },
        },
        {
          name: 'task-without-role',
          image: 'my-image',
          vpc: {
            subnetIds: ['subnet-1234', 'subnet-5678'],
            securityGroupIds: ['sg-1234'],
          },
          memory: '0.5GB',
          cpu: 256,
          service: {
            desiredCount: 1,
          },
          tags: {},
          environment: {},
          cloudFormationResource: {
            task: {},
            container: {},
            additionalContainers: [],
            service: {},
          },
        },
      ],
    }
  );

  expect(compiled.Resources.FargateIamExecutionRole).toBeDefined();
  expect(compiled.Resources.FargateIamTaskRole).toBeDefined();

  expect(
    compiled.Resources.TaskwithroleTask.Properties.ExecutionRoleArn
  ).toEqual('arn:aws:iam::123456789:role/CustomExecutionRole');
  expect(compiled.Resources.TaskwithroleTask.Properties.TaskRoleArn).toEqual(
    'arn:aws:iam::123456789:role/CustomTaskRole'
  );

  expect(
    compiled.Resources.TaskwithoutroleTask.Properties.ExecutionRoleArn
  ).toEqual({
    'Fn::Sub': '${FargateIamExecutionRole}',
  });
  expect(compiled.Resources.TaskwithoutroleTask.Properties.TaskRoleArn).toEqual(
    {
      'Fn::Sub': '${FargateIamTaskRole}',
    }
  );
});
