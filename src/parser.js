'use strict';

const { get } = require('./util');

const parseTask = (global, name, task) => {
  const definition = {
    name: task.name || name,
    image: task.image,
    executionRoleArn: task.executionRoleArn || global.executionRoleArn,
    taskRoleArn: task.taskRoleArn || global.taskRoleArn,
    vpc: {
      subnets: get(task, 'vpc.subnets', global.vpc.subnets),
      securityGroups: get(
        task,
        'vpc.securityGroups',
        global.vpc.securityGroups
      ),
      assignPublicIp: get(
        task,
        'vpc.assignPublicIp',
        global.vpc.assignPublicIp
      ),
    },
    command: task.command || [],
    entryPoint: task.entryPoint || [],
    memory: task.memory || global.memory,
    cpu: task.cpu || global.cpu,
    environment: {
      ...global.environment,
      ...(task.environment || {}),
    },
    tags: { ...global.tags, ...(task.tags || {}) },
  };

  if (task.schedule) {
    return {
      ...definition,
      schedule: task.schedule,
    };
  }

  const isStrictMode = get(task, 'service.strict', false);

  return {
    ...definition,
    service: {
      desiredCount: get(task, 'service.desiredCount', 1),
      maximumPercent: get(
        task,
        'service.maximumPercent',
        isStrictMode ? 100 : 200
      ),
      minimumHealthyPercent: get(
        task,
        'service.minimumHealthyPercent',
        isStrictMode ? 0 : 100
      ),
      spot: get(task, 'service.spot', false),
    },
  };
};

module.exports = config => {
  const global = {
    memory: config.memory || '0.5GB',
    cpu: config.cpu || 256,
    environment: config.environment || {},
    executionRoleArn: config.executionRoleArn,
    taskRoleArn: config.taskRoleArn,
    iamRoleStatements: config.iamRoleStatements || [],
    iamManagedPolicies: config.iamManagedPolicies || [],
    logGroupName: config.logGroupName,
    vpc: {
      subnets: get(config, 'vpc.subnets', []),
      securityGroups: get(config, 'vpc.securityGroups', []),
      assignPublicIp: get(config, 'vpc.assignPublicIp', false),
    },
    tags: config.tags || {},
  };

  return {
    ...global,
    tasks: Object.entries(config.tasks).map(([name, task]) =>
      parseTask(global, name, task)
    ),
  };
};
