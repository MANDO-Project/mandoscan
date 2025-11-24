#!/bin/bash

# ============================================
# MandoScan - AWS S3 + CloudFront Deployment Script
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="${AWS_S3_BUCKET_NAME}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BUILD_DIR="mando-tool"
DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID}"

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_message "$RED" "❌ AWS CLI is not installed. Please install it first:"
    print_message "$YELLOW" "   brew install awscli"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$BUCKET_NAME" ]; then
    print_message "$RED" "❌ AWS_S3_BUCKET_NAME environment variable is not set"
    exit 1
fi

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    print_message "$RED" "❌ AWS credentials are not set"
    exit 1
fi

print_message "$GREEN" "🚀 Starting deployment to AWS S3 + CloudFront..."
echo ""

# Step 1: Clean previous build
print_message "$YELLOW" "📦 Step 1: Cleaning previous build..."
rm -rf $BUILD_DIR
echo ""

# Step 2: Install dependencies
print_message "$YELLOW" "📦 Step 2: Installing dependencies..."
npm install
echo ""

# Step 3: Build the Next.js app
print_message "$YELLOW" "🔨 Step 3: Building Next.js application..."
npm run build
echo ""

# Step 4: Check if bucket exists, create if not
print_message "$YELLOW" "☁️  Step 4: Checking S3 bucket..."
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    print_message "$YELLOW" "Creating bucket $BUCKET_NAME..."
    aws s3 mb "s3://$BUCKET_NAME" --region "$AWS_REGION"
    print_message "$GREEN" "✅ Bucket created"
else
    print_message "$GREEN" "✅ Bucket already exists"
fi
echo ""

# Step 5: Sync files to S3
print_message "$YELLOW" "☁️  Step 5: Uploading files to S3..."
aws s3 sync $BUILD_DIR "s3://$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "*.json"

aws s3 sync $BUILD_DIR "s3://$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --exclude "*" \
    --include "*.html" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html"

aws s3 sync $BUILD_DIR "s3://$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --exclude "*" \
    --include "*.json" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "application/json"

print_message "$GREEN" "✅ Files uploaded to S3"
echo ""

# Step 6: Create or get CloudFront distribution
if [ -z "$DISTRIBUTION_ID" ]; then
    print_message "$YELLOW" "🌐 Step 6: Creating CloudFront distribution..."
    print_message "$BLUE" "This may take 15-20 minutes for the first deployment..."
    
    # Create CloudFront Origin Access Identity
    OAI_ID=$(aws cloudfront create-cloud-front-origin-access-identity \
        --cloud-front-origin-access-identity-config \
        CallerReference="mandoscan-$(date +%s)",Comment="OAI for MandoScan" \
        --query 'CloudFrontOriginAccessIdentity.Id' \
        --output text 2>/dev/null || echo "")
    
    if [ -z "$OAI_ID" ]; then
        print_message "$YELLOW" "Getting existing OAI..."
        OAI_ID=$(aws cloudfront list-cloud-front-origin-access-identities \
            --query "CloudFrontOriginAccessIdentityList.Items[0].Id" \
            --output text)
    fi
    
    # Create distribution config
    cat > /tmp/cf-distribution.json <<EOF
{
    "CallerReference": "mandoscan-$(date +%s)",
    "Comment": "MandoScan Distribution",
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Items": ["GET", "HEAD", "OPTIONS"],
            "Quantity": 3
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {"Forward": "none"}
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "Origins": {
        "Quantity": 1,
        "Items": [{
            "Id": "S3-$BUCKET_NAME",
            "DomainName": "$BUCKET_NAME.s3.$AWS_REGION.amazonaws.com",
            "S3OriginConfig": {
                "OriginAccessIdentity": "origin-access-identity/cloudfront/$OAI_ID"
            }
        }]
    },
    "DefaultRootObject": "index.html",
    "CustomErrorResponses": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/404.html",
                "ResponseCode": "404",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "Enabled": true
}
EOF
    
    DISTRIBUTION_ID=$(aws cloudfront create-distribution \
        --distribution-config file:///tmp/cf-distribution.json \
        --query 'Distribution.Id' \
        --output text)
    
    rm /tmp/cf-distribution.json
    
    print_message "$GREEN" "✅ CloudFront distribution created: $DISTRIBUTION_ID"
    print_message "$YELLOW" "💡 Save this for future deployments:"
    print_message "$YELLOW" "   export CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID"
    echo ""
else
    print_message "$YELLOW" "🌐 Step 6: Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id "$DISTRIBUTION_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text
    print_message "$GREEN" "✅ Cache invalidation initiated"
fi
echo ""

# Get CloudFront domain
CF_DOMAIN=$(aws cloudfront get-distribution \
    --id "$DISTRIBUTION_ID" \
    --query 'Distribution.DomainName' \
    --output text)

print_message "$GREEN" "✅ Deployment completed successfully!"
echo ""
print_message "$GREEN" "🌐 Your website is available at:"
print_message "$GREEN" "   https://$CF_DOMAIN"
echo ""
print_message "$YELLOW" "💡 Note: CloudFront may take a few minutes to propagate changes globally"
