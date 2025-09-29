#!/bin/bash

# Script to update the existing IAM policy with missing CloudFormation permissions

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
POLICY_NAME="AddressMeAmplifyDeploymentPolicy"
POLICY_FILE="infrastructure/iam-policy.json"

echo -e "${BLUE}🔄 Updating IAM policy with missing CloudFormation permissions${NC}"

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

# Get current AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
POLICY_ARN="arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"

echo -e "${BLUE}📋 Updating policy: $POLICY_ARN${NC}"

# Check if policy exists
if ! aws iam get-policy --policy-arn "$POLICY_ARN" &> /dev/null; then
    echo -e "${RED}❌ Policy $POLICY_NAME does not exist. Please run create-iam-user.sh first.${NC}"
    exit 1
fi

# Get current policy version
CURRENT_VERSION=$(aws iam get-policy --policy-arn "$POLICY_ARN" --query 'Policy.DefaultVersionId' --output text)
echo -e "${BLUE}📝 Current policy version: $CURRENT_VERSION${NC}"

# Create new policy version
echo -e "${BLUE}🔄 Creating new policy version...${NC}"
NEW_VERSION=$(aws iam create-policy-version \
    --policy-arn "$POLICY_ARN" \
    --policy-document file://"$POLICY_FILE" \
    --set-as-default \
    --query 'PolicyVersion.VersionId' \
    --output text)

echo -e "${GREEN}✅ Created new policy version: $NEW_VERSION${NC}"

# Delete old version (AWS allows max 5 versions)
if [ "$CURRENT_VERSION" != "v1" ]; then
    echo -e "${BLUE}🗑️  Deleting old policy version: $CURRENT_VERSION${NC}"
    aws iam delete-policy-version --policy-arn "$POLICY_ARN" --version-id "$CURRENT_VERSION" || true
fi

echo -e "${GREEN}🎉 Policy updated successfully!${NC}"
echo
echo -e "${BLUE}📋 Added CloudFormation permissions:${NC}"
echo "  - cloudformation:CreateChangeSet"
echo "  - cloudformation:DeleteChangeSet"
echo "  - cloudformation:DescribeChangeSet"
echo "  - cloudformation:ExecuteChangeSet"
echo "  - cloudformation:ListChangeSets"
echo "  - cloudformation:GetTemplateSummary"
echo
echo -e "${YELLOW}⏳ Policy changes may take a few seconds to propagate...${NC}"
echo -e "${GREEN}🚀 You can now retry your deployment!${NC}"