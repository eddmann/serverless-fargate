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
    {},
    {
      clusterName: undefined,
      containerInsights: undefined,
      memory: '0.5GB',
      cpu: 256,
      environment: {},
      iamRoleStatements: [],
      iamManagedPolicies: [],
      vpc: {
        subnetIds: ['subnet-1234', 'subnet-5678'],
        securityGroupIds: ['sg-1234'],
        assignPublicIp: false,
      },
      tags: {},
      tasks: [],
    }
  );

  const role = compiled.Resources.FargateIamTaskRole.Properties;
  expect(role.Policies).toEqual([]);
  expect(role.ManagedPolicyArns).toEqual([]);

  expect(compiled).toMatchSnapshot();
});
