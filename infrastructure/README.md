# AWS Amplify Deployment for AddressMe

This directory contains Infrastructure as Code (IaC) templates and scripts to deploy your Next.js application to AWS Amplify with Server-Side Rendering (SSR) support.

## Architecture Overview

- **AWS Amplify**: Hosts your Next.js app with SSR support
- **CloudFront CDN**: Global content delivery (included with Amplify)
- **IAM Roles**: Secure access to AWS Bedrock for AI features
- **Auto-scaling**: Handles traffic spikes automatically

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /
   
   # Configure AWS credentials
   aws configure
   ```

2. **GitHub Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Create a new token with `repo` and `admin:repo_hook` scopes
   - Keep the token secure for deployment

3. **Git Repository**
   - Push your code to GitHub
   - Ensure the repository is accessible with your token

## Quick Deployment

### Option 1: Automated Script (Recommended)

```bash
# Make the script executable
chmod +x infrastructure/deploy.sh

# Run the deployment
./infrastructure/deploy.sh
```

The script will prompt you for:
- GitHub repository URL
- GitHub branch (default: main)
- GitHub personal access token
- App name (default: address-me)
- Environment (default: production)
- AWS region (default: us-east-1)

### Option 2: Manual CloudFormation

```bash
# Deploy the stack manually
aws cloudformation deploy \
  --template-file infrastructure/amplify-deployment.yaml \
  --stack-name address-me-amplify \
  --parameter-overrides \
    GitHubRepository="https://github.com/your-username/address-me" \
    GitHubBranch="main" \
    GitHubToken="your-github-token" \
    AppName="address-me" \
    Environment="production" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

## Post-Deployment

After successful deployment:

1. **Check Build Status**: Visit the Amplify Console URL provided in the output
2. **Monitor Logs**: View build and deployment logs in the console
3. **Test Your App**: Access your app via the provided URL
4. **Set Environment Variables**: Add any additional environment variables in the Amplify Console

## Environment Variables

The deployment automatically configures:
- `AMPLIFY_MONOREPO_APP_ROOT`: Set to project root
- `AMPLIFY_DIFF_DEPLOY`: Optimizes builds
- `_LIVE_UPDATES`: Enables Next.js SSR features

Add custom environment variables in the Amplify Console:
1. Go to App Settings > Environment Variables
2. Add your variables (e.g., API keys, database URLs)

## Custom Domain (Optional)

To add a custom domain:

1. Uncomment the `AmplifyDomain` section in `amplify-deployment.yaml`
2. Update the domain name
3. Redeploy the stack
4. Configure DNS records as shown in Amplify Console

## Cost Optimization

- **Free Tier**: 1,000 build minutes and 15GB served per month
- **Pay-as-you-go**: ~$0.01 per build minute, ~$0.15 per GB served
- **Estimated monthly cost**: $2-15 for small to medium traffic

## Troubleshooting

### Build Failures
- Check Node.js version compatibility in Amplify Console
- Verify all dependencies are in `package.json`
- Review build logs for specific errors

### Permission Issues
- Ensure GitHub token has correct scopes
- Verify AWS credentials have necessary permissions
- Check IAM role policies in CloudFormation template

### Performance Issues
- Enable Performance Mode (included in template)
- Monitor CloudWatch metrics
- Consider upgrading Amplify compute resources if needed

## Cleanup

To remove all resources:

```bash
aws cloudformation delete-stack --stack-name address-me-amplify --region us-east-1
```

## Support

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js on Amplify Guide](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [CloudFormation Reference](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/)