module.exports = {
  type: 'object',
  additionalProperties: false,
  properties: {
    clusterName: { type: 'string' },
    memory: { type: 'string' },
    cpu: { type: 'integer', enum: [256, 512, 1024, 2048, 4096] },
    architecture: { type: 'string', enum: ['X86_64', 'ARM64'] },
    environment: { type: 'object' },
    executionRoleArn: { type: ['object', 'string'] },
    taskRoleArn: { type: ['object', 'string'] },
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
        securityGroupIds: { type: 'array', items: { type: 'string' } },
        subnetIds: { type: 'array', items: { type: 'string' } },
        assignPublicIp: { type: 'boolean' },
      },
    },
    tags: {
      type: 'object',
      patternProperties: {
        '^.+$': { type: 'string' },
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
            executionRoleArn: { type: ['object', 'string'] },
            taskRoleArn: { type: ['object', 'string'] },
            vpc: {
              type: 'object',
              properties: {
                securityGroupIds: {
                  type: 'array',
                  items: { type: 'string' },
                },
                subnetIds: { type: 'array', items: { type: 'string' } },
                assignPublicIp: { type: 'boolean' },
              },
            },
            command: { type: 'array', items: { type: 'string' } },
            entryPoint: { type: 'array', items: { type: 'string' } },
            memory: { type: 'string' },
            cpu: { type: 'integer', enum: [256, 512, 1024, 2048, 4096] },
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
          },
          additionalProperties: false,
        },
      },
    },
  },
};
