import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';

class CognitoStack {
  constructor(scope: Construct, id: string, domainNamePrefix: string, stage: string, region: string, props?: cdk.StackProps) {

    const fullId = `${stage}-${id}`;

    /**
     * Trigger Example code should be in another lambda and we can point the trigger to the Lambda Function ARN
     */
    // const postConfirmationLambda = new lambda.Function(scope, 'PostConfirmationLambda', {
    //   runtime: lambda.Runtime.NODEJS_18_X,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromAsset('path/to/your/lambda/code'), // Adjust the path accordingly
    //   functionName: 'MyPostConfirmationLambda',
    //   description: 'Lambda function for post-confirmation trigger',
    // });

    // Grant necessary permissions to the Lambda function
    // postConfirmationLambda.addToRolePolicy(new iam.PolicyStatement({
    //   actions: ['cognito-idp:AdminUpdateUserAttributes'],
    //   resources: [userPool.userPoolArn],
    // }));

    // userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, postConfirmationLambda);


    // Create a Cognito User Pool
    const userPool = new cognito.UserPool(scope, `${fullId}-user-pool`, {
      userPoolName: `${fullId}-user-pool`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
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

    let groupName = 'Business';
    new cognito.CfnUserPoolGroup(scope, `${fullId}-${groupName.toLowerCase()}-group`, {
      groupName,
      userPoolId: userPool.userPoolId,
    });

    groupName = 'Admin';
    new cognito.CfnUserPoolGroup(scope, `${fullId}-${groupName.toLowerCase()}-group`, {
      groupName,
      userPoolId: userPool.userPoolId,
    });

    groupName = 'Customer';
    new cognito.CfnUserPoolGroup(scope, `${fullId}-${groupName.toLowerCase()}-group`, {
      groupName,
      userPoolId: userPool.userPoolId,
    });

    userPool.addClient(`${fullId}-mobile-client`, {
      userPoolClientName: `${fullId}-mobile-client`,
      oAuth: {
        flows: {
          authorizationCodeGrant: false,
          implicitCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.EMAIL, cognito.OAuthScope.OPENID],
        callbackUrls: ['http://localhost:8080/code'], // Replace with your actual callback URL
        logoutUrls: ['http://localhost:8080/logout'], // Replace with your actual logout URL
      },
    });

    // Create an IAM role for authenticated users
    new iam.Role(scope, `${fullId}-role`, {
      roleName: `${fullId}-role`,
      assumedBy: new iam.FederatedPrincipal('cognito-identity.amazonaws.com', {
        StringEquals: { 'cognito-identity.amazonaws.com:aud': userPool.userPoolId },
        'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
      }, 'sts:AssumeRoleWithWebIdentity'),
    });

    // Attach policies to the authenticated role if needed
    // authenticatedRole.attachInlinePolicy(...);

    // Configure Google as an authentication provider
    userPool.addDomain(`${fullId}-domain-name`, {
      cognitoDomain: {
        domainPrefix: domainNamePrefix, // Replace with your desired domain prefix
      },
    });

    // Output the User Pool ID
    new cdk.CfnOutput(scope, `${fullId}-user-pool-id`, {
      value: userPool.userPoolId,
    });
  }
}

// class LambdaStack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     const userFunction = new lambda.Function(scope, `${id}-lambda`, {
//       runtime: lambda.Runtime.NODEJS_18_X,
//       code: lambda.Code.fromAsset("../aws_dist/"),
//       handler: "lambda.handler"
//     })
//
//     // defines an API Gateway REST API resource backed by our "hello" function.
//     const httpApi: apiGatewayV2.HttpApi = new apiGatewayV2.HttpApi(scope, `${id}-api`);
//
//     // Add an integration for the Lambda function
//     const lambdaIntegration = new integrations.HttpLambdaIntegration(`${id}-integration`,userFunction);
//
//     // Balance this with the setting in lambda.ts setGlobalPrefix setting.
//     httpApi.addRoutes({
//       path: '/api/{proxy+}',
//       methods: [ apiGatewayV2.HttpMethod.GET ],
//       integration: lambdaIntegration,
//     });
//   }
// }

export class AuthCdk extends cdk.Stack {
  constructor(scope: Construct, id: string, stage: string, region: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new CognitoStack(this, `demo-auth`, `${stage}-starter-demo`, stage, region, props);
  }
}
