#!/bin/bash

# Cleanup script for failed AWS CloudFormation stack
# This script deletes a failed stack so you can redeploy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 AWS CloudFormation Stack Cleanup${NC}"

# Load configuration
CONFIG_FILE="infrastructure/deploy-config.sh"
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${GREEN}📋 Loading configuration from $CONFIG_FILE${NC}"
    source "$CONFIG_FILE"
else
    echo -e "${RED}❌ Configuration file not found: $CONFIG_FILE${NC}"
    exit 1
fi

# Set AWS profile if specified
if [ -n "$AWS_PROFILE" ]; then
    export AWS_PROFILE="$AWS_PROFILE"
    echo -e "${BLUE}🔑 Using AWS profile: $AWS_PROFILE${NC}"
fi

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed.${NC}"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI configured${NC}"

# Check if stack exists
echo -e "${BLUE}🔍 Checking stack status...${NC}"
STACK_STATUS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query "Stacks[0].StackStatus" \
    --output text 2>/dev/null || echo "STACK_NOT_FOUND")

if [ "$STACK_STATUS" = "STACK_NOT_FOUND" ]; then
    echo -e "${GREEN}✅ No stack found with name: $STACK_NAME${NC}"
    echo -e "${BLUE}🚀 You can now run ./infrastructure/deploy.sh${NC}"
    exit 0
fi

echo -e "${YELLOW}📊 Current stack status: $STACK_STATUS${NC}"

# Check if stack can be deleted
case "$STACK_STATUS" in
    "ROLLBACK_COMPLETE"|"CREATE_FAILED"|"DELETE_FAILED"|"UPDATE_ROLLBACK_COMPLETE")
        echo -e "${YELLOW}⚠️  Stack is in a failed state and needs to be deleted${NC}"
        ;;
    "DELETE_IN_PROGRESS")
        echo -e "${BLUE}⏳ Stack deletion already in progress...${NC}"
        echo -e "${YELLOW}💡 Wait for deletion to complete, then run deploy.sh${NC}"
        exit 0
        ;;
    "CREATE_IN_PROGRESS"|"UPDATE_IN_PROGRESS")
        echo -e "${RED}❌ Stack operation in progress. Wait for it to complete first.${NC}"
        exit 1
        ;;
    *)
        echo -e "${YELLOW}⚠️  Stack exists in state: $STACK_STATUS${NC}"
        echo -e "${YELLOW}💡 This will delete the existing stack and all its resources.${NC}"
        ;;
esac

echo
echo -e "${BLUE}📋 Stack Details:${NC}"
echo "Stack Name: $STACK_NAME"
echo "Region: $AWS_REGION"
echo "Status: $STACK_STATUS"
echo

read -p "Delete this stack? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏹️  Cleanup cancelled${NC}"
    exit 0
fi

echo -e "${BLUE}🗑️  Deleting CloudFormation stack...${NC}"

# Delete the stack
aws cloudformation delete-stack \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION"

echo -e "${GREEN}✅ Stack deletion initiated${NC}"
echo -e "${BLUE}⏳ Waiting for stack deletion to complete...${NC}"

# Wait for deletion to complete
aws cloudformation wait stack-delete-complete \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Stack deleted successfully!${NC}"
    echo
    echo -e "${BLUE}🚀 You can now run:${NC}"
    echo "   ./infrastructure/deploy.sh"
else
    echo -e "${RED}❌ Stack deletion failed or timed out${NC}"
    echo -e "${YELLOW}💡 Check the CloudFormation console for details${NC}"
    exit 1
fi