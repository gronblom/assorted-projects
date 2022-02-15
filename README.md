# assorted-projects

These are different projects of mine for learning new concepts, libraries and languages. They are meant to be proper learning experiences, albeit smaller in size, not simply "hello world" projects. They are alse meant to answer questions such as "Can you code?" and "Can you learn new things effectively?".

## quiz-app

A react multiplayer quiz app. The backend uses graphql and web sockets and fetches questions from [opentdb](https://opentdb.com/).

- [quiz-app-frontend](https://github.com/gronblom/assorted-projects/tree/main/quiz-app-frontend)
- [quiz-app-backend](https://github.com/gronblom/assorted-projects/tree/main/quiz-app-backend)
- [Screenshot](https://imgur.com/a/X06gvK0)
- [heroku instance](https://infinite-garden-02616.herokuapp.com/) (multiplayer can be tested by opening another instance in a private window with another username)


## aws

- [amplify-app](https://github.com/gronblom/assorted-projects/tree/main/aws/amplify-app)
This is an AWS amplify "hello world" app with user authentication, based on a tutorial. It was pushed to github only to test amplify deployment (as it otherwise do not contain much of my own code).

- [digital-signature-lambda](https://github.com/gronblom/assorted-projects/tree/main/aws/digital-signature-lambda) A python lambda function that creates digital signatures for data.

  [Lambda](https://github.com/gronblom/assorted-projects/blob/main/aws/digital-signature-lambda/lambda/digital_signature.py)
 
  
  [CDK stack](https://github.com/gronblom/assorted-projects/blob/main/aws/digital-signature-lambda/digital_signature_lambda/digital_signature_lambda_stack.py)

- [ecs-quiz-app](https://github.com/gronblom/assorted-projects/tree/main/aws/ecs-quiz-app) My quiz app deployed to ECS. Automatic configuration after deployment is not yet done.

  [CDK Stack](https://github.com/gronblom/assorted-projects/blob/main/aws/ecs-quiz-app/lib/ecs-quiz-app-stack.ts)

  [Backend image](https://github.com/gronblom/assorted-projects/blob/main/aws/ecs-quiz-app/backend-image/Dockerfile)

  [Frontend image](https://github.com/gronblom/assorted-projects/blob/main/aws/ecs-quiz-app/frontend-image/Dockerfile)

  [github actions](https://github.com/gronblom/assorted-projects/blob/main/.github/workflows/github-actions-emoji-casino.yml)

- [emoji-casino](https://github.com/gronblom/assorted-projects/tree/main/aws/emoji-casino) A mock casino app that returns random wins and emojis. Every bet with it's result is saved to DynamoDB.

  [Backend lambda](https://github.com/gronblom/assorted-projects/blob/main/aws/emoji-casino/backend/lambda/emoji_casino.js)

  [Backend CDK stack](https://github.com/gronblom/assorted-projects/blob/main/aws/emoji-casino/backend/lib/backend-stack.ts)

  [Frontend React app](https://github.com/gronblom/assorted-projects/blob/main/aws/emoji-casino/frontend/src/App.tsx)

  [Screenshot](https://github.com/gronblom/assorted-projects/blob/main/aws/emoji-casino/img/emoji_casino_screenshot.png)

- [movie-rental-api](https://github.com/gronblom/assorted-projects/tree/main/aws/movie-rental-api) RDS postgresql deployment and initialization CDK stack. The db is the [MySQL "sakila" test database in PostgreSQL](https://github.com/devrimgunduz/pagila).  Also contains a LambdaRestApi that tests a simple select query.

    Create VPC, RDS and init db with a [lambda function](https://github.com/gronblom/assorted-projects/blob/main/aws/movie-rental-api/lib/movie-rental-db.ts)

    The db initialization from schema with a lambda, [resource-init.ts](https://github.com/gronblom/assorted-projects/blob/main/aws/movie-rental-api/lib/resource-init.ts) and [db-init](https://github.com/gronblom/assorted-projects/tree/main/aws/movie-rental-api/lib/db-init), is based on this [article](https://aws.amazon.com/blogs/infrastructure-and-automation/use-aws-cdk-to-initialize-amazon-rds-instances/)

    Test lambda for simple select query:
    
    [Lambda](https://github.com/gronblom/assorted-projects/blob/main/aws/movie-rental-api/lib/lambda/dbApiLambda/index.ts)
    
    [CDK stack](https://github.com/gronblom/assorted-projects/blob/main/aws/movie-rental-api/lib/movie-rental-lambda-api.ts)

- [quiz-app-ec2](https://github.com/gronblom/assorted-projects/tree/main/aws/quiz-app-ec2) Create two ec2 instances for the backend and frontend of my quiz app.

  [CDK stack](https://github.com/gronblom/assorted-projects/blob/main/aws/quiz-app-ec2/lib/quiz-app-aws-cdk-stack.ts)

## misc

- [Reaktor 2020 coding challenge part 3 in haskell.](https://github.com/gronblom/assorted-projects/tree/main/reactor-hunt-2020)

  [part-3-app.hs](https://github.com/gronblom/assorted-projects/blob/main/reactor-hunt-2020/part_3_app.hs)
  
- [Kotlin + spring boot + postgresql test app](https://github.com/gronblom/assorted-projects/tree/main/kotlin-backend-test)

  [KotlinBackendTestApplication.kt](https://github.com/gronblom/assorted-projects/blob/main/kotlin-backend-test/src/main/kotlin/com/example/kotlinbackendtest/KotlinBackendTestApplication.kt)

- [vertx-kotlin-test](https://github.com/gronblom/assorted-projects/tree/main/vertx-kotlin-test) VertX kotlin test app with json schema validation and jwt creation.

  [MainVerticle.kt](https://github.com/gronblom/assorted-projects/blob/main/vertx-kotlin-test/src/main/kotlin/com/example/starter/MainVerticle.kt)

- [Go and Kotlin solutions for Advent of Code 2021](https://github.com/gronblom/assorted-projects/tree/main/advent-of-code-2021)

## courses

These two courses are excellent and are much harder than those I took when I was studying.

- [Full Stack open](https://github.com/gronblom/assorted-projects/tree/main/fullstackopen)
- [Haskell MOOC](https://github.com/gronblom/assorted-projects/tree/main/haskell-mooc)


