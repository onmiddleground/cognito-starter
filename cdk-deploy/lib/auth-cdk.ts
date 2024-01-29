import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_sqs as sqs } from 'aws-cdk-lib';
import { aws_sns as sns } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import * as apiGatewayV2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

class CognitoStack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {

    const postConfirmationLambda = new lambda.Function(scope, 'PostConfirmationLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('path/to/your/lambda/code'), // Adjust the path accordingly
      functionName: 'MyPostConfirmationLambda',
      description: 'Lambda function for post-confirmation trigger',
    });

    // Create a Cognito User Pool
    const userPool = new cognito.UserPool(scope, `${id}-user-pool`, {
      userPoolName: `demo-auth`,
      selfSignUpEnabled: true, // Allow users to sign up
      signInAliases: { email: true }, // Allow sign in with email
      autoVerify: { email: false }, // Automatically verify user's email addresses
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY, // Allow account recovery through email
    });

    // Grant necessary permissions to the Lambda function
    postConfirmationLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['cognito-idp:AdminUpdateUserAttributes'],
      resources: [userPool.userPoolArn],
    }));

    userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, postConfirmationLambda);


    // userPool.addClient("demo", {
    //
    // })

    // const userPoolClient = userPool.addClient('MyUserPoolClient', {
    //   oAuth: {
    //     flows: {
    //       authorizationCodeGrant: true,
    //       implicitCodeGrant: true,
    //     },
    //     scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID],
    //     callbackUrls: ['YOUR_CALLBACK_URL'], // Replace with your actual callback URL
    //     logoutUrls: ['YOUR_LOGOUT_URL'], // Replace with your actual logout URL
    //   },
    // });

    // Create an IAM role for authenticated users
    // const authenticatedRole = new iam.Role(scope, 'MyAuthenticatedRole', {
    //   assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
    //     StringEquals: { 'cognito-identity.amazonaws.com:aud': userPool.userPoolId },
    //     'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
    //   }, 'sts:AssumeRoleWithWebIdentity'),
    // });

    // Attach policies to the authenticated role if needed
    // authenticatedRole.attachInlinePolicy(...);

    // Configure Google as an authentication provider
    // userPool.addDomain('MyUserPoolDomain', {
    //   cognitoDomain: {
    //     domainPrefix: 'my-user-pool-domain-prefix', // Replace with your desired domain prefix
    //   },
    // });

    // Output the User Pool ID
    new cdk.CfnOutput(scope, 'UserPoolId', {
      value: userPool.userPoolId,
    });
  }
}

class LambdaStack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    const userFunction = new lambda.Function(scope, `${id}-lambda`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("../aws_dist/"),
      handler: "lambda.handler"
    })

    // defines an API Gateway REST API resource backed by our "hello" function.
    const httpApi: apiGatewayV2.HttpApi = new apiGatewayV2.HttpApi(scope, `${id}-api`);

    // Add an integration for the Lambda function
    const lambdaIntegration = new integrations.HttpLambdaIntegration(`${id}-integration`,userFunction);

    // Balance this with the setting in lambda.ts setGlobalPrefix setting.
    httpApi.addRoutes({
      path: '/api/{proxy+}',
      methods: [ apiGatewayV2.HttpMethod.GET ],
      integration: lambdaIntegration,
    });
  }
}

export class AuthCdk extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // new LambdaStack(this, "auth", props);
    new CognitoStack(this, "auth", props);

    // const queue = new sqs.Queue(this, 'CdkWorkshopQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // const topic = new sns.Topic(this, 'CdkWorkshopTopic');

    // topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
