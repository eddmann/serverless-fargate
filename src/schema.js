module.exports = {
  type: 'object',
  additionalProperties: false,
  properties: {
    autoScalingGroupCapacityProviderName: { type: 'string' },
    memory: { type: 'string' },
    cpu: { type: 'integer', enum: [256, 512, 1024, 2048, 4096] },
    environment: { type: 'object' },
    executionRoleArn: { type: 'string' },
    taskRoleArn: { type: 'string' },
    logGroupName: { type: 'string' },
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
            executionRoleArn: { type: 'string' },
            taskRoleArn: { type: 'string' },
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
            environment: { type: 'object' },
            tags: { type: 'object' },
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
