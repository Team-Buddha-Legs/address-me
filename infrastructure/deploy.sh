#!/bin/bash

# AWS Amplify Deployment Script for Address Me
# This script deploys your Next.js app to AWS Amplify with SSR support

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting AWS Amplify deployment for Address Me${NC}"

# Load configuration
CONFIG_FILE="infrastructure/deploy-config.sh"
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${GREEN}📋 Loading configuration from $CONFIG_FILE${NC}"
    source "$CONFIG_FILE"
else
    echo -e "${RED}❌ Configuration file not found: $CONFIG_FILE${NC}"
    echo -e "${YELLOW}💡 Please copy and edit infrastructure/deploy-config.sh with your values${NC}"
    exit 1
fi

# Validate required configuration
if [ -z "$GITHUB_REPO" ] || [ "$GITHUB_REPO" = "your-github-token-here" ]; then
    echo -e "${RED}❌ Please set GITHUB_REPO in $CONFIG_FILE${NC}"
    exit 1
fi

if [ -z "$GITHUB_TOKEN" ] || [ "$GITHUB_TOKEN" = "your-github-token-here" ]; then
    echo -e "${RED}❌ Please set GITHUB_TOKEN in $CONFIG_FILE${NC}"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Set AWS profile if specified
if [ -n "$AWS_PROFILE" ]; then
    export AWS_PROFILE="$AWS_PROFILE"
    echo -e "${BLUE}🔑 Using AWS profile: $AWS_PROFILE${NC}"
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"

echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "Stack Name: $STACK_NAME"
echo "Repository: $GITHUB_REPO"
echo "Branch: $GITHUB_BRANCH"
echo "App Name: $APP_NAME"
echo "Environment: $ENVIRONMENT"
echo "Region: $AWS_REGION"
echo "Template: $TEMPLATE_FILE"
if [ -n "$AWS_PROFILE" ]; then
    echo "AWS Profile: $AWS_PROFILE"
fi
echo

echo -e "${BLUE}🔄 Deploying CloudFormation stack...${NC}"

# Deploy the CloudFormation stack
aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --parameter-overrides \
        GitHubRepository="$GITHUB_REPO" \
        GitHubBranch="$GITHUB_BRANCH" \
        GitHubToken="$GITHUB_TOKEN" \
        AppName="$APP_NAME" \
        Environment="$ENVIRONMENT" \
        BedrockApiKey="${BEDROCK_API_KEY:-}" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "$AWS_REGION"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ CloudFormation stack deployed successfully!${NC}"
    
    # Get stack outputs
    echo -e "${BLUE}📊 Getting deployment information...${NC}"
    
    APP_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query "Stacks[0].Outputs[?OutputKey=='AmplifyAppUrl'].OutputValue" \
        --output text)
    
    CONSOLE_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query "Stacks[0].Outputs[?OutputKey=='AmplifyConsoleUrl'].OutputValue" \
        --output text)
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo
    echo -e "${BLUE}📱 Your app will be available at:${NC}"
    echo "   $APP_URL"
    echo
    echo -e "${BLUE}🔧 Amplify Console:${NC}"
    echo "   $CONSOLE_URL"
    echo
    echo -e "${YELLOW}⏳ Note: Initial build may take 5-10 minutes to complete.${NC}"
    echo -e "${YELLOW}📝 Check the Amplify Console for build progress.${NC}"
    
else
    echo -e "${RED}❌ Deployment failed. Check the error messages above.${NC}"
    exit 1
fi