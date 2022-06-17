const parse = require('../parser');

test('minimal service task configuration', () => {
  const parsed = parse({
    vpc: {
      securityGroupIds: ['sg-1234'],
      subnetIds: ['subnet-1234'],
    },
    tasks: {
      'my-task': {
        image: 'my-image',
      },
    },
  });

  expect(parsed).toMatchSnapshot();
});

test('minimal scheduled task configuration', () => {
  const parsed = parse({
    vpc: {
      securityGroupIds: ['sg-1234'],
      subnetIds: ['subnet-1234'],
    },
    tasks: {
      'my-task': {
        image: 'my-image',
        schedule: 'rate(1 minute)',
      },
    },
  });

  expect(parsed).toMatchSnapshot();
});

test('full service task configuration', () => {
  const parsed = parse({
    clusterName: 'my-cluster-name',
    containerInsights: true,
    memory: '1GB',
    cpu: 512,
    environment: {
      global: 'variable',
    },
    executionRoleArn: 'arn:aws:iam::123456:role/my-custom-execution-role',
    taskRoleArn: 'arn:aws:iam::123456:role/my-custom-task-role',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['resource:*'],
        Resource: '*',
      },
    ],
    iamManagedPolicies: ['arn:aws:iam::aws:policy/my-managed-policy'],
    vpc: {
      securityGroupIds: ['sg-1234'],
      subnetIds: ['subnet-1234'],
      assignPublicIp: false,
    },
    tags: {
      global: 'tag',
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
    tasks: {
      'task-1': {
        name: 'my-task-1',
        image: 'my-image-1',
        executionRoleArn:
          'arn:aws:iam::123456:role/my-custom-execution-role-for-task-1',
        taskRoleArn: 'arn:aws:iam::123456:role/my-custom-task-role-for-task-1',
        vpc: {
          securityGroupIds: ['sg-5678'],
          subnetIds: ['subnet-5678'],
          assignPublicIp: true,
        },
        command: ['command'],
        entryPoint: ['entrypoint'],
        memory: '2GB',
        cpu: 1024,
        environment: {
          task: 'variable',
        },
        service: {
          desiredCount: 2,
          maximumPercent: 100,
          minimumHealthyPercent: 0,
          spot: true,
        },
        tags: {
          task: 'tag',
        },
        cloudFormationResource: {
          task: {
            RuntimePlatform: {
              CpuArchitecture: 'ARM64',
              OperatingSystemFamily: 'LINUX',
            },
          },
          container: {
            StartTimeout: 5,
          },
          service: {
            LoadBalancers: {
              ContainerName: 'container-name',
              ContainerPort: 8080,
              TargetGroupArn: 'target-group-arn',
            },
          },
        },
      },
      'task-2': {
        image: 'my-image-2',
      },
    },
  });

  expect(parsed).toMatchSnapshot();
});

test('full service task configuration(ARM64)', () => {
  const parsed = parse({
    clusterName: 'my-cluster-name',
    containerInsights: true,
    memory: '1GB',
    cpu: 512,
    architecture: 'ARM64',
    environment: {
      global: 'variable',
    },
    executionRoleArn: 'arn:aws:iam::123456:role/my-custom-execution-role',
    taskRoleArn: 'arn:aws:iam::123456:role/my-custom-task-role',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['resource:*'],
        Resource: '*',
      },
    ],
    iamManagedPolicies: ['arn:aws:iam::aws:policy/my-managed-policy'],
    vpc: {
      securityGroupIds: ['sg-1234'],
      subnetIds: ['subnet-1234'],
      assignPublicIp: false,
    },
    tags: {
      global: 'tag',
    },
    tasks: {
      'task-1': {
        name: 'my-task-1',
        image: 'my-image-1',
        executionRoleArn:
          'arn:aws:iam::123456:role/my-custom-execution-role-for-task-1',
        taskRoleArn: 'arn:aws:iam::123456:role/my-custom-task-role-for-task-1',
        vpc: {
          securityGroupIds: ['sg-5678'],
          subnetIds: ['subnet-5678'],
          assignPublicIp: true,
        },
        command: ['command'],
        entryPoint: ['entrypoint'],
        memory: '2GB',
        cpu: 1024,
        environment: {
          task: 'variable',
        },
        service: {
          desiredCount: 2,
          maximumPercent: 100,
          minimumHealthyPercent: 0,
          spot: true,
        },
        tags: {
          task: 'tag',
        },
      },
      'task-2': {
        image: 'my-image-2',
      },
    },
  });

  expect(parsed).toMatchSnapshot();
});
