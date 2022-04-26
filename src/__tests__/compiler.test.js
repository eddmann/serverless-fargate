const compile = require('../compiler');

test('single service task', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
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

test('single service task using ec2 provider', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
      autoScalingGroupCapacityProviderName: 'my-asg-capacity-provider',
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
      tasks: [
        {
          autoScalingGroupCapacityProviderName: 'my-asg-capacity-provider',
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
        },
      ],
    }
  );

  expect(compiled).toMatchSnapshot();
});

test('single scheduled task using ec2 provider', () => {
  const compiled = compile(
    {
      'my-image': 'image-uri',
    },
    {
      autoScalingGroupCapacityProviderName: 'my-asg-capacity-provider',
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
      tasks: [
        {
          autoScalingGroupCapacityProviderName: 'my-asg-capacity-provider',
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
        },
      ],
    }
  );

  expect(compiled).toMatchSnapshot();
});
