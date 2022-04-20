# 🚀 Serverless Fargate

Adds the ability to maintain long-running Fargate ECS tasks within your Serverless project.

## Overview

Not all behaviour can be broken down and modelled within Lambda's execution duration constraints.
Sometimes you need the ability to exceed this duration, but wish to remain in a Serverless environment.

This plugin adds the ability to declare Fargate-backed ECS tasks which are provisioned during a Serverless deployment.
Taking advantage of Serverless Frameworks ability to build/push images to ECR, you are able to declare both long-running and Lambda-based behaviour side-by-side.

At a high-level the plugin provides the following functionality:

- Allows you to declare service-based (continuous) and scheduled tasks.
- Uses the ECR image support provided within Serverless Framework to help build tasks.
- Maintains an IAM role which honours all managed policies and statements that have been declared within the provider configuration.
- Provides _escape-hatches_ to supply custom configuration such as role ARNs/tags etc.
- Handles both Fargate and Fargate Spot execution environments.

## Example

Below is an example configuration which highlights all possible available options.

```yaml
provider:
  # (required) similar to Lambda-containers, images defined within the provider are available to tasks.
  ecr:
    images:
      my-task:
        path: ./
        file: Dockerfile

  # (optional) role statements present within the provider are added to the task role.
  iamRoleStatements:
    - Effect: Allow
      Action: 'sqs:*'
      Resource: '*'

  # (optional) managed polices present within the provider are added to the task role.
  iamManagedPolicies:
    - arn:aws:iam::123456:policy/my-managed-provider-policy

  # (optional) environment variables present within the provider are added to all tasks.
  environment:
    name: value

  vpc:
    # (optional) default security groups which are added to tasks that do not contain any overrides.
    securityGroupIds:
      - sg-12345

    # (required) default subnets which are added to tasks that do not contain any overrides.
    # all tasks MUST be assigned subnets as Fargate operates within `awsvpc` mode.
    subnetIds:
      - subnet-1234

  # (optional) tags present within the provider are added to task resources.
  tags:
    name: value

fargate:
  # (optional) default memory you wish to allocate to each task (if not supplied at the task level) - defaults to 0.5GB.
  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size
  memory: '0.5GB'

  # (optional) default CPU you wish to allocate to each task (if not supplied at the task level) - defaults to 256 (.25 vCPU).
  # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size
  cpu: 256

  # (optional) environment variables which are added to all tasks.
  environment:
    name: value

  # (optional) name used for the provisoned log group
  logGroupName: my-cluster-log-group

  # (optional) default execution role ARN you wish to use for the task.
  executionRoleArn: arn:aws:iam::123456:role/my-custom-execution-role

  # (optional) default task role ARN you wish to use for the task.
  taskRoleArn: arn:aws:iam::123456:role/my-custom-task-role

  # (optional) additional role statements you wish to add to the task role, you would place statements here instead of at
  # the provider level if you only wished them to target Fargate tasks.
  iamRoleStatements:
    - Effect: Allow
      Action: 'resource:*'
      Resource: '*'

  # (optional) additional managed policies you wish to add to the task role, you would place policies here instead of at
  # the provider level if you only wished them to target Fargate tasks.
  iamManagedPolicies:
    - arn:aws:iam::123456:policy/my-managed-task-policy

  vpc:
    # (optional) default security groups which are added to tasks that do not contain any overrides; these override any provider-level configuration.
    securityGroupIds:
      - sg-12345

    # (required) default subnets which are added to tasks that do not contain any overrides; these override any provider-level configuration.
    # all tasks MUST be assigned subnets as Fargate operates within `awsvpc` mode.
    subnetIds:
      - subnet-1234

    # (optional) default flag to assign a public IP to each task, this requires the supplied subnets to be public (internet) facing.
    assignPublicIp: false

  # (optional) additional tags you wish to apply to only Fargate task resources.
  tags:
    name: value

  tasks:
    my-task:
      # (optional) unique name for the given task, defaults to the task key name.
      name: my-task-name

      # (required) the task image you wish to run, references images built within the `ecr` section.
      image: my-task

      # (optional) execution role ARN you wish to use for the given task.
      executionRoleArn: arn:aws:iam::123456:role/my-custom-execution-role

      # (optional) task role ARN you wish to use for the given task.
      taskRoleArn: arn:aws:iam::123456:role/my-custom-task-role

      vpc:
        # (optional) security groups you wish to apply to the given tasks; these override any provider/fargate-level configuration.
        securityGroupIds:
          - sg-12345

        # (required) subnets you wish to apply to the given tasks; these override any provider/fargate-level configuration.
        # all tasks MUST be assigned subnets as Fargate operates within `awsvpc` mode.
        subnetIds:
          - subnet-1234

        # (optional) flag to assign a public IP to the given task, this requires the supplied subnets to be public (internet) facing.
        assignPublicIp: false

      # (optional) the overridden command you wish to execute within the task container.
      command:
        - my-command

      # (optional) the overridden entrypoint you wish to execute within the task container.
      entryPoint:
        - my-entrypoint

      # (optional) memory you wish to allocate to the given task, defaults to the globally supplied memory value.
      # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size
      memory: '0.5GB'

      # (optional) CPU you wish to allocate to the given task, defaults to the globally supplied CPU value.
      # https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#task_size
      cpu: 256

      # (optional) environment variables which are added to the given task, these are combined with
      # the globally supplied environment variables
      environment:
        name: value

      # (optional) additional tags you wish to apply to the given task, these are combined with
      # the provider and globally supplied tags.
      tags:
        name: value

      # (optional) by default a task is deemed to be a service with a desired count of one,
      # this results in a single long-running process which is a typical use-case of the plugin.
      # however, if you wish to alter this you can include the following configuration options.
      service:
        # (optional) the desired amount of running tasks for the given service.
        desiredCount: 1

        # (optional) used during deployment to determine how many tasks can be provisioned for the transition phase.
        maximumPercent: 200

        # (optional) used during deployment to determine how many tasks are required to remain active for the transition phase.
        minimumHealthyPercent: 100

        # (optional) flag to determine if you wish to provision the task using Fargate Spot.
        # note: at this time there is no fallback measures in-place to ensure that the task will be provisioned using
        # on-demand Fargate if the spot instance can not be acquired.
        spot: false

      # (optional) schedule expression used to configure the task to be executed at a desired time, as opposed to being a service.
      # https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
      schedule: 'rate(1 minute)'
```

---

Inspired by https://github.com/svdgraaf/serverless-fargate-tasks
