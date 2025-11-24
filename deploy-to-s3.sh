#!/bin/bash

# ============================================
# MandoScan - AWS S3 Deployment Script
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="${AWS_S3_BUCKET_NAME}"
AWS_REGION="${AWS_REGION:-us-east-1}"
BUILD_DIR="mando-tool"

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
    print_message "$YELLOW" "   export AWS_S3_BUCKET_NAME=your-bucket-name"
    exit 1
fi

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
    print_message "$RED" "❌ AWS credentials are not set"
    print_message "$YELLOW" "   export AWS_ACCESS_KEY_ID=your-access-key"
    print_message "$YELLOW" "   export AWS_SECRET_ACCESS_KEY=your-secret-key"
    exit 1
fi

print_message "$GREEN" "🚀 Starting deployment to AWS S3..."
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
    
    # Enable static website hosting
    aws s3 website "s3://$BUCKET_NAME" \
        --index-document index.html \
        --error-document 404.html
    
    print_message "$GREEN" "✅ Bucket created and configured for static website hosting"
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

# Upload HTML files with different cache settings
aws s3 sync $BUILD_DIR "s3://$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --exclude "*" \
    --include "*.html" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html"

# Upload JSON files
aws s3 sync $BUILD_DIR "s3://$BUCKET_NAME" \
    --region "$AWS_REGION" \
    --exclude "*" \
    --include "*.json" \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "application/json"

echo ""

# Step 6: Set bucket policy for public read access
print_message "$YELLOW" "🔒 Step 6: Setting bucket policy..."
cat > /tmp/bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file:///tmp/bucket-policy.json

rm /tmp/bucket-policy.json
echo ""

# Step 7: Disable "Block all public access"
print_message "$YELLOW" "🔓 Step 7: Configuring public access..."
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
echo ""

# Get the website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"

print_message "$GREEN" "✅ Deployment completed successfully!"
echo ""
print_message "$GREEN" "🌐 Your website is available at:"
print_message "$GREEN" "   $WEBSITE_URL"
echo ""
print_message "$YELLOW" "💡 Tips:"
print_message "$YELLOW" "   - For HTTPS support, consider setting up CloudFront"
print_message "$YELLOW" "   - For custom domain, use Route 53"
print_message "$YELLOW" "   - Run './deploy-to-s3.sh' anytime to redeploy"
