# MandoScan AWS S3 Deployment Guide

This guide will help you deploy your MandoScan web application to AWS S3.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **AWS CLI**: Install AWS CLI on your machine
   ```bash
   brew install awscli
   ```
3. **Node.js**: Ensure Node.js is installed (v18 or higher)

## Quick Start

### 1. Configure AWS Credentials

Create a copy of the example environment file:
```bash
cp .env.deployment.example .env.deployment
```

Edit `.env.deployment` and add your AWS credentials:
```bash
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_S3_BUCKET_NAME="mandoscan-webapp"  # Choose a unique bucket name
export AWS_REGION="us-east-1"  # Optional, defaults to us-east-1
```

### 2. Load Environment Variables

```bash
source .env.deployment
```

### 3. Deploy to S3

Make the script executable and run it:
```bash
chmod +x deploy-to-s3.sh
./deploy-to-s3.sh
```

The script will:
- ✅ Clean previous builds
- ✅ Install dependencies
- ✅ Build your Next.js application
- ✅ Create S3 bucket (if needed)
- ✅ Upload files to S3
- ✅ Configure bucket for static website hosting
- ✅ Set appropriate permissions

### 4. Access Your Website

After deployment, your website will be available at:
```
http://[bucket-name].s3-website-[region].amazonaws.com
```

## Deploy with CloudFront (Recommended for Production)

CloudFront provides:
- ✅ HTTPS support
- ✅ Global CDN with edge locations
- ✅ Better performance
- ✅ Custom domain support

### Deploy with CloudFront:

```bash
chmod +x deploy-with-cloudfront.sh
./deploy-with-cloudfront.sh
```

After the first deployment, save your distribution ID:
```bash
export CLOUDFRONT_DISTRIBUTION_ID="E1234567890ABC"
```

Add it to your `.env.deployment` file for future deployments.

## Deployment Options Comparison

| Feature | S3 Only | S3 + CloudFront |
|---------|---------|-----------------|
| Cost | Lower | Higher (but still affordable) |
| HTTPS | ❌ No | ✅ Yes |
| Custom Domain | Limited | ✅ Yes |
| Global Performance | Regional | ✅ Global CDN |
| Setup Time | Fast | 15-20 min first time |

## Getting AWS Credentials

### Option 1: IAM User (Recommended for Development)

1. Go to AWS Console → IAM → Users
2. Click "Create user"
3. Give it a name (e.g., "mandoscan-deployer")
4. Select "Attach policies directly"
5. Attach these policies:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess` (if using CloudFront)
6. Create user
7. Go to "Security credentials" tab
8. Click "Create access key"
9. Choose "Command Line Interface (CLI)"
10. Save the Access Key ID and Secret Access Key

### Option 2: AWS CLI Configuration

Alternatively, configure AWS CLI:
```bash
aws configure
```

Then you don't need to export credentials in `.env.deployment`.

## Updating Your Website

To update your website after making changes:

```bash
# Load credentials if not already loaded
source .env.deployment

# Deploy
./deploy-to-s3.sh
# or for CloudFront
./deploy-with-cloudfront.sh
```

## Custom Domain Setup

### With S3 Only:
1. Bucket name must match your domain (e.g., `www.mandoscan.com`)
2. Configure Route 53 or your DNS provider to point to S3 website endpoint
3. Note: No HTTPS support without CloudFront

### With CloudFront:
1. In CloudFront, add your domain as an alternate domain name (CNAME)
2. Request an SSL certificate in AWS Certificate Manager
3. Update CloudFront distribution to use the certificate
4. Point your DNS to the CloudFront distribution domain

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install`
- Ensure Node.js version is compatible (v18+)
- Check for errors in your code

### Deployment Fails
- Verify AWS credentials are correct
- Check that bucket name is globally unique
- Ensure you have necessary IAM permissions

### Website Not Loading
- Wait a few minutes for changes to propagate
- Check bucket policy allows public read access
- For CloudFront, wait 15-20 minutes for initial distribution setup

### 403 Forbidden Error
- Verify bucket policy is set correctly
- Check that "Block all public access" is disabled for the bucket
- Ensure index.html exists in the bucket

## Cost Estimation

### S3 Only:
- Storage: ~$0.023 per GB/month
- Data Transfer: $0.09 per GB (first 10 TB)
- Requests: $0.0004 per 1,000 GET requests
- **Typical small app**: $1-5/month

### S3 + CloudFront:
- Add CloudFront costs: $0.085 per GB data transfer
- **Typical small app**: $5-15/month

## Security Best Practices

1. **Never commit credentials**: Add `.env.deployment` to `.gitignore`
2. **Use IAM roles**: In production, use EC2 instance roles or similar
3. **Rotate keys regularly**: Change access keys every 90 days
4. **Principle of least privilege**: Only grant necessary permissions
5. **Enable CloudTrail**: Monitor AWS API calls
6. **Use CloudFront**: For HTTPS and better security

## CI/CD Integration

### GitHub Actions Example:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to AWS S3

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_S3_BUCKET_NAME: ${{ secrets.AWS_S3_BUCKET_NAME }}
          AWS_REGION: us-east-1
        run: |
          aws s3 sync mando-tool s3://$AWS_S3_BUCKET_NAME --delete
```

Add secrets to GitHub: Settings → Secrets → Actions

## Additional Resources

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

## Support

For issues or questions:
- Check the troubleshooting section above
- Review AWS CloudWatch logs
- Check Next.js build output for errors
