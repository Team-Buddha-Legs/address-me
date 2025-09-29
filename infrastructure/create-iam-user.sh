#!/bin/bash

# Script to create IAM user for AWS Amplify deployment
# Run this with admin AWS credentials

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IAM_USER_NAME="address-me-deployer"
POLICY_NAME="AddressMeAmplifyDeploymentPolicy"
POLICY_FILE="infrastructure/iam-policy.json"

echo -e "${BLUE}🔐 Creating IAM user for Address Me deployment${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"

# Get current AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${BLUE}📋 AWS Account ID: $ACCOUNT_ID${NC}"

# Create IAM user
echo -e "${BLUE}👤 Creating IAM user: $IAM_USER_NAME${NC}"
if aws iam get-user --user-name "$IAM_USER_NAME" &> /dev/null; then
    echo -e "${YELLOW}⚠️  User $IAM_USER_NAME already exists${NC}"
else
    aws iam create-user --user-name "$IAM_USER_NAME"
    echo -e "${GREEN}✅ Created IAM user: $IAM_USER_NAME${NC}"
fi

# Create IAM policy
echo -e "${BLUE}📜 Creating IAM policy: $POLICY_NAME${NC}"
POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"

if aws iam get-policy --policy-arn "$POLICY_ARN" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Policy $POLICY_NAME already exists, updating...${NC}"
    # Get current policy version
    CURRENT_VERSION=$(aws iam get-policy --policy-arn "$POLICY_ARN" --query 'Policy.DefaultVersionId' --output text)
    # Create new version
    aws iam create-policy-version \
        --policy-arn "$POLICY_ARN" \
        --policy-document file://"$POLICY_FILE" \
        --set-as-default
    # Delete old version (keep only 2 versions max)
    if [ "$CURRENT_VERSION" != "v1" ]; then
        aws iam delete-policy-version --policy-arn "$POLICY_ARN" --version-id "$CURRENT_VERSION" || true
    fi
    echo -e "${GREEN}✅ Updated IAM policy: $POLICY_NAME${NC}"
else
    aws iam create-policy \
        --policy-name "$POLICY_NAME" \
        --policy-document file://"$POLICY_FILE" \
        --description "Policy for deploying Address Me app to AWS Amplify"
    echo -e "${GREEN}✅ Created IAM policy: $POLICY_NAME${NC}"
fi

# Attach policy to user
echo -e "${BLUE}🔗 Attaching policy to user${NC}"
aws iam attach-user-policy \
    --user-name "$IAM_USER_NAME" \
    --policy-arn "$POLICY_ARN"
echo -e "${GREEN}✅ Attached policy to user${NC}"

# Create access keys
echo -e "${BLUE}🔑 Creating access keys${NC}"
ACCESS_KEY_OUTPUT=$(aws iam create-access-key --user-name "$IAM_USER_NAME" 2>/dev/null || echo "")

if [ -n "$ACCESS_KEY_OUTPUT" ]; then
    ACCESS_KEY_ID=$(echo "$ACCESS_KEY_OUTPUT" | jq -r '.AccessKey.AccessKeyId')
    SECRET_ACCESS_KEY=$(echo "$ACCESS_KEY_OUTPUT" | jq -r '.AccessKey.SecretAccessKey')
    
    echo -e "${GREEN}✅ Created access keys${NC}"
    echo
    echo -e "${YELLOW}🔐 IMPORTANT: Save these credentials securely!${NC}"
    echo -e "${BLUE}Access Key ID:${NC} $ACCESS_KEY_ID"
    echo -e "${BLUE}Secret Access Key:${NC} $SECRET_ACCESS_KEY"
    echo
    echo -e "${YELLOW}⚠️  These credentials will not be shown again!${NC}"
    echo
    echo -e "${BLUE}📝 To configure AWS CLI with these credentials:${NC}"
    echo "aws configure --profile address-me-deploy"
    echo "AWS Access Key ID: $ACCESS_KEY_ID"
    echo "AWS Secret Access Key: $SECRET_ACCESS_KEY"
    echo "Default region name: us-east-1"
    echo "Default output format: json"
    echo
    echo -e "${BLUE}🚀 Then deploy using the profile:${NC}"
    echo "AWS_PROFILE=address-me-deploy ./infrastructure/deploy.sh"
    
else
    echo -e "${YELLOW}⚠️  Access keys may already exist for this user${NC}"
    echo -e "${BLUE}📝 List existing access keys:${NC}"
    echo "aws iam list-access-keys --user-name $IAM_USER_NAME"
fi

echo
echo -e "${GREEN}🎉 IAM setup completed successfully!${NC}"