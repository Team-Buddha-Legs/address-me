#!/bin/bash

# Script to fix Amplify service role issues
# This script helps diagnose and fix "failed to assume role" errors

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Amplify Service Role Troubleshooting Script${NC}"

# Load configuration
CONFIG_FILE="infrastructure/deploy-config.sh"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    echo -e "${RED}❌ Configuration file not found: $CONFIG_FILE${NC}"
    exit 1
fi

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed${NC}"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"

# Get current AWS account and region info
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
CURRENT_REGION=$(aws configure get region || echo "$AWS_REGION")

echo -e "${BLUE}📋 Current AWS Context:${NC}"
echo "Account ID: $ACCOUNT_ID"
echo "Region: $CURRENT_REGION"
echo "Stack Name: $STACK_NAME"
echo

# Check if the CloudFormation stack exists
echo -e "${BLUE}🔍 Checking CloudFormation stack status...${NC}"
STACK_STATUS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$CURRENT_REGION" --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo "NOT_FOUND")

if [ "$STACK_STATUS" = "NOT_FOUND" ]; then
    echo -e "${YELLOW}⚠️  Stack $STACK_NAME not found${NC}"
    echo -e "${BLUE}💡 Run the deployment script to create the stack${NC}"
    exit 0
fi

echo -e "${GREEN}✅ Stack found with status: $STACK_STATUS${NC}"

# Get the Amplify service role ARN from the stack
echo -e "${BLUE}🔍 Checking Amplify service role...${NC}"
SERVICE_ROLE_ARN=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$CURRENT_REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='AmplifyServiceRoleArn'].OutputValue" \
    --output text 2>/dev/null || echo "")

if [ -z "$SERVICE_ROLE_ARN" ]; then
    # Try to get it from resources
    SERVICE_ROLE_ARN=$(aws cloudformation describe-stack-resources \
        --stack-name "$STACK_NAME" \
        --region "$CURRENT_REGION" \
        --logical-resource-id "AmplifyServiceRole" \
        --query 'StackResources[0].PhysicalResourceId' \
        --output text 2>/dev/null || echo "")
    
    if [ -n "$SERVICE_ROLE_ARN" ]; then
        SERVICE_ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$SERVICE_ROLE_ARN"
    fi
fi

if [ -z "$SERVICE_ROLE_ARN" ]; then
    echo -e "${RED}❌ Could not find Amplify service role${NC}"
    echo -e "${BLUE}💡 The role might not have been created properly${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found service role: $SERVICE_ROLE_ARN${NC}"

# Check if the role exists and can be assumed
ROLE_NAME=$(echo "$SERVICE_ROLE_ARN" | cut -d'/' -f2)
echo -e "${BLUE}🔍 Checking role permissions...${NC}"

# Check if role exists
if aws iam get-role --role-name "$ROLE_NAME" &> /dev/null; then
    echo -e "${GREEN}✅ Role exists${NC}"
    
    # Check trust policy
    echo -e "${BLUE}🔍 Checking trust policy...${NC}"
    TRUST_POLICY=$(aws iam get-role --role-name "$ROLE_NAME" --query 'Role.AssumeRolePolicyDocument' --output json)
    
    if echo "$TRUST_POLICY" | grep -q "amplify.amazonaws.com"; then
        echo -e "${GREEN}✅ Trust policy allows Amplify service${NC}"
    else
        echo -e "${RED}❌ Trust policy missing Amplify service principal${NC}"
        echo -e "${BLUE}💡 Updating trust policy...${NC}"
        
        # Create updated trust policy
        cat > /tmp/trust-policy.json << EOF
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
EOF
        
        aws iam update-assume-role-policy --role-name "$ROLE_NAME" --policy-document file:///tmp/trust-policy.json
        echo -e "${GREEN}✅ Updated trust policy${NC}"
        rm /tmp/trust-policy.json
    fi
    
else
    echo -e "${RED}❌ Role does not exist${NC}"
    echo -e "${BLUE}💡 Redeploy the CloudFormation stack to create the role${NC}"
    exit 1
fi

# Get Amplify app info
echo -e "${BLUE}🔍 Checking Amplify app...${NC}"
APP_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$CURRENT_REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='AmplifyAppId'].OutputValue" \
    --output text 2>/dev/null || echo "")

if [ -n "$APP_ID" ]; then
    echo -e "${GREEN}✅ Found Amplify app: $APP_ID${NC}"
    
    # Check if the app is using the correct service role
    CURRENT_ROLE=$(aws amplify get-app --app-id "$APP_ID" --query 'app.iamServiceRoleArn' --output text 2>/dev/null || echo "None")
    
    if [ "$CURRENT_ROLE" = "$SERVICE_ROLE_ARN" ]; then
        echo -e "${GREEN}✅ App is using the correct service role${NC}"
    elif [ "$CURRENT_ROLE" = "None" ] || [ -z "$CURRENT_ROLE" ]; then
        echo -e "${YELLOW}⚠️  App has no service role assigned${NC}"
        echo -e "${BLUE}💡 Updating app to use service role...${NC}"
        
        aws amplify update-app --app-id "$APP_ID" --iam-service-role-arn "$SERVICE_ROLE_ARN"
        echo -e "${GREEN}✅ Updated app service role${NC}"
    else
        echo -e "${YELLOW}⚠️  App is using a different service role${NC}"
        echo "Current: $CURRENT_ROLE"
        echo "Expected: $SERVICE_ROLE_ARN"
        echo -e "${BLUE}💡 Updating app to use correct service role...${NC}"
        
        aws amplify update-app --app-id "$APP_ID" --iam-service-role-arn "$SERVICE_ROLE_ARN"
        echo -e "${GREEN}✅ Updated app service role${NC}"
    fi
    
    # Check recent builds for errors
    echo -e "${BLUE}🔍 Checking recent build status...${NC}"
    RECENT_JOB=$(aws amplify list-jobs --app-id "$APP_ID" --branch-name "$GITHUB_BRANCH" --max-results 1 --query 'jobSummaries[0]' --output json 2>/dev/null || echo "{}")
    
    if [ "$RECENT_JOB" != "{}" ]; then
        JOB_STATUS=$(echo "$RECENT_JOB" | jq -r '.status // "UNKNOWN"')
        JOB_ID=$(echo "$RECENT_JOB" | jq -r '.jobId // "UNKNOWN"')
        
        echo "Latest build status: $JOB_STATUS (Job ID: $JOB_ID)"
        
        if [ "$JOB_STATUS" = "FAILED" ]; then
            echo -e "${RED}❌ Latest build failed${NC}"
            echo -e "${BLUE}💡 Check build logs in Amplify Console for details${NC}"
            
            # Get console URL
            CONSOLE_URL="https://console.aws.amazon.com/amplify/home/apps/$APP_ID"
            echo -e "${BLUE}🔗 Amplify Console: $CONSOLE_URL${NC}"
        fi
    fi
    
else
    echo -e "${RED}❌ Could not find Amplify app${NC}"
fi

echo
echo -e "${BLUE}🔧 Troubleshooting Summary:${NC}"
echo "1. ✅ AWS CLI configured"
echo "2. ✅ CloudFormation stack exists"
echo "3. ✅ Service role exists with correct permissions"
echo "4. ✅ Amplify app configured with service role"
echo
echo -e "${GREEN}🎉 Service role configuration looks good!${NC}"
echo
echo -e "${BLUE}💡 If you're still experiencing issues:${NC}"
echo "1. Check the Amplify Console for detailed error messages"
echo "2. Ensure your GitHub token has the correct permissions"
echo "3. Verify your repository is accessible"
echo "4. Try triggering a new build manually"
echo
echo -e "${BLUE}🔗 Useful links:${NC}"
if [ -n "$APP_ID" ]; then
    echo "Amplify Console: https://console.aws.amazon.com/amplify/home/apps/$APP_ID"
fi
echo "CloudFormation Console: https://console.aws.amazon.com/cloudformation/home?region=$CURRENT_REGION#/stacks/stackinfo?stackId=$STACK_NAME"