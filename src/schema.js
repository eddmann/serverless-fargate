module.exports = {
  type: 'object',
  additionalProperties: false,
  properties: {
    clusterName: { type: 'string' },
    containerInsights: { type: 'boolean' },
    memory: { type: 'string' },
    cpu: { type: 'integer', enum: [256, 512, 1024, 2048, 4096, 8192, 16384] },
    architecture: { type: 'string', enum: ['X86_64', 'ARM64'] },
    environment: { type: 'object' },
    executionRoleArn: { anyOf: [{ type: 'object' }, { type: 'string' }] },
    taskRoleArn: { anyOf: [{ type: 'object' }, { type: 'string' }] },
    logGroupName: { type: 'string' },
    logRetentionInDays: {
      type: 'integer',
      enum: [
        1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545, 731, 1827,
        2192, 2557, 2922, 3288, 3653,
      ],
    },
    iamRoleStatements: { type: 'array' },
    iamManagedPolicies: { type: 'array', items: { type: 'string' } },
    vpc: {
      type: 'object',
      properties: {
        securityGroupIds: {
          type: 'array',
          items: { anyOf: [{ type: 'object' }, { type: 'string' }] },
        },
        subnetIds: {
          type: 'array',
          items: { anyOf: [{ type: 'object' }, { type: 'string' }] },
        },
        assignPublicIp: { type: 'boolean' },
      },
    },
    tags: {
      type: 'object',
      patternProperties: {
        '^.+$': { type: 'string' },
      },
    },
    cloudFormationResource: {
      type: 'object',
      properties: {
        task: { type: 'object' },
        container: { type: 'object' },
        additionalContainers: { type: 'array' },
        service: { type: 'object' },
      },
    },
    tasks: {
      type: 'object',
      patternProperties: {
        '^[a-zA-Z0-9-]+$': {
          type: 'object',
          properties: {
            name: { type: 'string' },
            image: { type: 'string' },
            executionRoleArn: {
              anyOf: [{ type: 'object' }, { type: 'string' }],
            },
            taskRoleArn: { anyOf: [{ type: 'object' }, { type: 'string' }] },
            vpc: {
              type: 'object',
              properties: {
                securityGroupIds: {
                  type: 'array',
                  items: { anyOf: [{ type: 'object' }, { type: 'string' }] },
                },
                subnetIds: {
                  type: 'array',
                  items: { anyOf: [{ type: 'object' }, { type: 'string' }] },
                },
                assignPublicIp: { type: 'boolean' },
              },
            },
            command: { type: 'array', items: { type: 'string' } },
            entryPoint: { type: 'array', items: { type: 'string' } },
            memory: { type: 'string' },
            cpu: { type: 'integer', enum: [256, 512, 1024, 2048, 4096, 8192, 16384] },
            architecture: { type: 'string', enum: ['X86_64', 'ARM64'] },
            environment: { type: 'object' },
            tags: { type: 'object' },
            dependsOn: { type: 'array', items: { type: 'string' } },
            service: {
              type: 'object',
              properties: {
                desiredCount: { type: 'integer' },
                maximumPercent: { type: 'integer' },
                minimumHealthyPercent: { type: 'integer' },
                spot: { type: 'boolean' },
              },
            },
            schedule: { type: 'string' },
            cloudFormationResource: {
              type: 'object',
              properties: {
                task: { type: 'object' },
                container: { type: 'object' },
                service: { type: 'object' },
              },
            },
          },
          additionalProperties: false,
        },
      },
    },
  },
};
