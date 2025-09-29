# Fixing Amplify "Failed to Assume Role" Error

This guide helps you resolve the "failed to assume role" error during Amplify builds.

## What Was Fixed

The CloudFormation template has been updated with a comprehensive Amplify service role that includes:

1. **Proper Trust Policy**: Allows both `amplify.amazonaws.com` and `lambda.amazonaws.com` to assume the role
2. **Complete Permissions**: All necessary permissions for Amplify SSR deployments including:
   - Lambda functions (for SSR)
   - CloudFormation (for infrastructure)
   - S3 (for build artifacts)
   - CloudFront (for CDN)
   - IAM (for execution roles)
   - CloudWatch Logs (for monitoring)
   - Bedrock (for AI features)

## Quick Fix Steps

### 1. Redeploy with Updated Template

```bash
# Set your GitHub token (if not already set)
export GITHUB_TOKEN="your-github-token-here"

# Deploy the updated stack
./infrastructure/deploy.sh
```

### 2. Run the Troubleshooting Script

```bash
# Check and fix any remaining role issues
./infrastructure/fix-amplify-role.sh
```

### 3. Trigger a New Build

After the deployment completes:
1. Go to the Amplify Console (URL provided in deployment output)
2. Navigate to your app
3. Click "Run build" to trigger a new deployment
4. Monitor the build logs for any remaining issues

## Manual Verification Steps

If you want to verify the fix manually:

### Check Service Role in AWS Console

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Navigate to Roles
3. Find your role: `address-me-amplify-service-role`
4. Verify the trust policy includes:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Service": "amplify.amazonaws.com"
         },
         "Action": "sts:AssumeRole"
       },
       {
         "Effect": "Allow",
         "Principal": {
           "Service": "lambda.amazonaws.com"
         },
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```

### Check Amplify App Configuration

1. Go to [Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app
3. Go to App Settings > General
4. Verify "Service role" is set to your service role ARN

## Common Issues and Solutions

### Issue: "Role does not exist"
**Solution**: Redeploy the CloudFormation stack to create the role

### Issue: "Access denied when assuming role"
**Solution**: Check that the trust policy includes `amplify.amazonaws.com`

### Issue: "Lambda permissions denied"
**Solution**: Ensure the service role has Lambda permissions (included in updated template)

### Issue: "Build still failing after role fix"
**Solution**: 
1. Check GitHub token permissions
2. Verify repository access
3. Review build logs in Amplify Console
4. Ensure `package.json` has correct build scripts

## Verification Commands

```bash
# Check if role exists
aws iam get-role --role-name address-me-amplify-service-role

# Check Amplify app service role
aws amplify get-app --app-id YOUR_APP_ID --query 'app.iamServiceRoleArn'

# List recent builds
aws amplify list-jobs --app-id YOUR_APP_ID --branch-name main --max-results 5
```

## Next Steps

After fixing the role issue:

1. **Monitor the build**: Watch the first build after the fix
2. **Test your app**: Verify SSR functionality works correctly
3. **Set environment variables**: Add any required env vars in Amplify Console
4. **Configure custom domain**: If needed, uncomment the domain section in the template

## Support Resources

- [AWS Amplify Service Role Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/amplify-service-role.html)
- [Next.js SSR on Amplify Guide](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [Amplify Build Troubleshooting](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting.html)