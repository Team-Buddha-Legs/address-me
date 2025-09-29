#!/bin/bash

# Deployment Configuration for AddressMe
# Edit these values to match your setup

# GitHub Configuration
GITHUB_REPO="https://github.com/Team-Buddha-Legs/address-me"
GITHUB_BRANCH="main"
# GITHUB_TOKEN="github-token, please set by env var"

# Application Configuration
APP_NAME="address-me"
ENVIRONMENT="PRODUCTION"

# AWS Configuration
AWS_REGION="ap-southeast-1"
STACK_NAME="address-me-amplify"

# Optional: AWS Profile (leave empty to use default)
AWS_PROFILE=""

# Template Configuration
TEMPLATE_FILE="infrastructure/amplify-deployment.yaml"

# Env vars
# BEDROCK_API_KEY="please set by env var"
