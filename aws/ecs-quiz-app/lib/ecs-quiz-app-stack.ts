import { Stack, StackProps, aws_ecs, aws_ecs_patterns } from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class EcsQuizAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, 'QuizAppFrontend', {
      taskImageOptions: {
        image: aws_ecs.ContainerImage.fromRegistry('public.ecr.aws/y1e1f2r7/quiz-app-frontend:latest'),
        containerPort: 80
      },
      publicLoadBalancer: true
    });

    new aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, 'QuizAppBackend', {
      taskImageOptions: {
        image: aws_ecs.ContainerImage.fromRegistry('public.ecr.aws/y1e1f2r7/quiz-app-backend:latest'),
        containerPort: 4000
      },
      publicLoadBalancer: true
    });
  }
}
