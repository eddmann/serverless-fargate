# 🚀 Serverless Fargate Tasks

Adds the ability to maintain long-running Fargate tasks within your Serverless project.

## Overview

Not all behaviour can be broken down and modelled within Lambda's execution duration constraints.
Sometimes you need the ability to exceed this duration, but wish to remain in a Serverless environment.

This plugin adds the ability to declare Fargate-backed tasks which are provisioned during a Serverless deployment.
Taking advantage of Serverless Frameworks ability to build/push images to ECR, you are able to declare both long-running and Lambda-based behaviour side-by-side.

- Allows you to declare service-based (continuous) and scheduled tasks.
- Uses the ECR image support provided within Serverless Framework to help build tasks.
- Maintains an IAM role which honours all managed policies and statements that have been declared within the provider configuration.
- Provides _escape-hatches_ to supply custom configuration such as role ARNs/tags etc.
- Handles both Fargate and Fargate Spot execution environments.

## Example

Below is an example configuration which highlights all possible available options.

```yaml
provider:
  ecr:
    images:
      my-task:
        path: ./
        file: Dockerfile

custom:
  fargate:
    memory: '0.5GB'
    cpu: 256
    environment:
      name: value

    executionRoleArn: arn:aws:iam::123456:role/my-custom-execution-role
    taskRoleArn: arn:aws:iam::123456:role/my-custom-task-role
    iamRoleStatements:
      - Effect: Allow
        Action: 'sqs:*'
        Resource: '*'
    iamManagedPolicies:
      - arn:aws:iam::123456:policy/my-managed-policy

    vpc:
      securityGroups:
        - sg-12345
      subnets:
        - subnet-1234
      assignPublicIp: false

    tags:
      name: value

    tasks:
      my-service-task:
        name: my-service-task-name
        image: my-task
        executionRoleArn: arn:aws:iam::123456:role/my-custom-execution-role
        taskRoleArn: arn:aws:iam::123456:role/my-custom-task-role
        vpc:
          securityGroups:
            - sg-12345
          subnets:
            - subnet-1234
          assignPublicIp: false
        command:
          - my-command
        entryPoint:
          - my-entrypoint
        memory: '0.5GB'
        cpu: 256
        environment:
          name: value
        tags:
          name: value
        service:
          desiredCount: 1
          maximumPercent: 200
          minimumHealthyPercent: 100
          spot: false
      my-scheduled-task:
        image: my-scheduled-task-name
        schedule: 'rate(1 minute)'
```

---

Inspired by https://github.com/svdgraaf/serverless-fargate-tasks
