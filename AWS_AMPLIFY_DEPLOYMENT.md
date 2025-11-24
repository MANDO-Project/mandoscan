# AWS Amplify Deployment Guide for Mandoscan

## Quick Start Checklist

- [ ] Code pushed to GitHub
- [ ] AWS Amplify app created and connected to repository
- [ ] Environment variables configured in Amplify
- [ ] Custom domain `mandoguru.com` configured
- [ ] Backend API CORS updated
- [ ] Cognito callback URLs updated

---

## Step 1: Push Code to GitHub

### 1.1 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `mandoscan`
3. Set to **Private** (recommended)
4. Don't initialize with README
5. Click "Create repository"

### 1.2 Push Your Code

Run these commands in your project directory:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AWS Amplify deployment"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mandoscan.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to AWS Amplify

### 2.1 Create Amplify App

1. **Open AWS Amplify Console:**
   - URL: https://console.aws.amazon.com/amplify/
   - Region: Select **ap-southeast-1** (Singapore) to match your Cognito

2. **Start New App:**
   - Click "New app" → "Host web app"
   - Select **GitHub** as source
   - Click "Continue"

3. **Authorize GitHub:**
   - Click "Authorize AWS Amplify"
   - Grant access to your repositories

4. **Select Repository:**
   - Repository: `mandoscan`
   - Branch: `main`
   - Click "Next"

### 2.2 Configure Build Settings

1. **App Name:** `mandoscan`

2. **Build Settings:** (Should auto-detect from `amplify.yml`)
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: mando-tool
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```

3. **Click "Next"**

### 2.3 Add Environment Variables (CRITICAL)

Click "Advanced settings" and add these variables:

| Key | Value | Example |
|-----|-------|---------|
| `NEXT_PUBLIC_COGNITO_DOMAIN` | Your Cognito domain | `mandoguru.auth.ap-southeast-1.amazoncognito.com` |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Your Cognito app client ID | `1a2b3c4d5e6f7g8h9i0j` |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | `ap-southeast-1_Uu8mUX2F6` | (or your pool ID) |
| `NEXT_PUBLIC_COGNITO_REGION` | `ap-southeast-1` | |
| `SCAN_API_BASE_URL` | Your backend API URL | `https://api.mandoguru.com` or `http://your-ip:5555` |

### 2.4 Service Role

- Select "Create new role" (if first time)
- Follow prompts to create `amplifyconsole-backend-role`
- Or select existing role if you have one

### 2.5 Deploy

1. Click "Next"
2. Review all settings
3. Click "Save and deploy"
4. Wait 5-10 minutes for first deployment

---

## Step 3: Configure Custom Domain

### 3.1 Add Domain in Amplify

1. In Amplify Console, go to your app
2. Left sidebar → Click "Domain management"
3. Click "Add domain"

### 3.2 Select Domain

1. **Domain:** Select `mandoguru.com` from dropdown
   - (Should auto-appear if domain is in Route 53)
2. Click "Configure domain"

### 3.3 Configure Subdomains

Set up these configurations:

| Subdomain | Branch | Type |
|-----------|--------|------|
| `mandoguru.com` | main | Root |
| `www.mandoguru.com` | main | Subdomain |

Click "Save"

### 3.4 SSL Certificate

Amplify will automatically:
- ✅ Request/use ACM certificate
- ✅ Configure CloudFront distribution
- ✅ Update Route 53 DNS records

**This takes 15-30 minutes**

### 3.5 Verify Domain Status

Wait until status shows:
- ✅ **Available** (green checkmark)
- If stuck, check Route 53 for DNS records

---

## Step 4: Update Backend Configuration

### 4.1 Update Backend API CORS

Your backend must allow requests from:

```
https://mandoguru.com
https://www.mandoguru.com
https://main.xxxxxx.amplifyapp.com
```

Add these to your backend's CORS allowed origins.

### 4.2 Update AWS Cognito

1. **Go to AWS Cognito Console:**
   - URL: https://console.aws.amazon.com/cognito/
   - Select your User Pool: `ap-southeast-1_Uu8mUX2F6`

2. **Update App Client Settings:**
   - Go to "App integration" → "App client list"
   - Select your app client
   - Click "Edit"

3. **Update Allowed Callback URLs:**
   ```
   https://mandoguru.com/callback
   https://www.mandoguru.com/callback
   https://main.xxxxxx.amplifyapp.com/callback
   http://localhost:3000/callback
   ```

4. **Update Allowed Sign-out URLs:**
   ```
   https://mandoguru.com
   https://www.mandoguru.com
   https://main.xxxxxx.amplifyapp.com
   http://localhost:3000
   ```

5. Click "Save changes"

---

## Step 5: Test Your Deployment

### 5.1 Test Amplify URL

1. Get your Amplify URL from console (e.g., `https://main.xxxxx.amplifyapp.com`)
2. Open in browser
3. Test:
   - [ ] Page loads
   - [ ] Login works
   - [ ] File upload works
   - [ ] File listing displays
   - [ ] Scan button functions

### 5.2 Test Custom Domain

Once domain status is "Available":

1. Visit `https://mandoguru.com`
2. Verify HTTPS works (green lock icon)
3. Test all functionality again

### 5.3 Check Browser Console

- Open DevTools (F12)
- Check Console for errors
- Verify API calls succeed

---

## Step 6: Continuous Deployment

Now every push to GitHub will auto-deploy:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Amplify automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# Takes 5-10 minutes
```

---

## Troubleshooting

### Build Fails

**Check build logs:**
1. Amplify Console → Your app
2. Click on failed build
3. Expand "Build" phase
4. Look for error messages

**Common fixes:**
- Ensure `package.json` has all dependencies
- Check `amplify.yml` syntax
- Verify Node version compatibility

### Can't Access Site

**Check domain status:**
1. Amplify Console → Domain management
2. Verify status is "Available"
3. If pending, wait 15-30 minutes

**Clear DNS cache:**
```bash
# On Mac
sudo dscacheutil -flushcache

# On Windows
ipconfig /flushdns
```

### Authentication Errors

**Verify:**
- [ ] Cognito callback URLs include your Amplify domain
- [ ] Environment variables are set correctly in Amplify
- [ ] Cognito domain matches `NEXT_PUBLIC_COGNITO_DOMAIN`

### API Connection Fails

**Check:**
- [ ] `SCAN_API_BASE_URL` is correct in Amplify env vars
- [ ] Backend API is accessible from internet
- [ ] Backend CORS allows your Amplify domain
- [ ] Check browser console for CORS errors

### 503 Service Unavailable

This means your backend API is unreachable:
- Verify `SCAN_API_BASE_URL` is correct
- Ensure backend server is running
- Check security groups/firewalls allow traffic

---

## Managing Your App

### Update Environment Variables

1. Amplify Console → Your app
2. "Environment variables" (left sidebar)
3. Click "Manage variables"
4. Edit values
5. Save
6. Go to "Deployments" → Click "Redeploy this version"

### View Logs

**Build logs:**
- Amplify Console → Your app → Any deployment

**Runtime logs:**
- Enable in Amplify settings
- View in CloudWatch Logs

### Rollback Deployment

If something breaks:

1. Amplify Console → Your app → Deployments
2. Find last working version
3. Click "..." → "Redeploy this version"

---

## Cost Estimate

**AWS Amplify (Light Traffic):**
- Build minutes: 5 min × $0.01 = $0.05 per deployment
- Hosting: 5 GB + 15 GB transfer = ~$0.50/month
- SSL: Free (ACM)

**Route 53:**
- Hosted zone: $0.50/month
- DNS queries: ~$0.40/month (1M queries)

**Total:** ~$15-25/month

---

## Security Checklist

- [ ] `.env*` files in `.gitignore`
- [ ] Secrets only in Amplify environment variables
- [ ] GitHub repository set to Private
- [ ] Enable branch protection on `main`
- [ ] Regular dependency updates: `npm audit fix`
- [ ] HTTPS enforced (automatic with Amplify)

---

## Next Steps

After successful deployment:

1. **Set up staging environment:**
   - Create `develop` branch
   - Connect to Amplify
   - Deploy to separate subdomain: `staging.mandoguru.com`

2. **Enable monitoring:**
   - Set up CloudWatch alarms
   - Configure budget alerts

3. **Optimize performance:**
   - Enable CloudFront caching
   - Monitor Core Web Vitals

---

## Support Resources

- **AWS Amplify Docs:** https://docs.aws.amazon.com/amplify/
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **AWS Support:** https://console.aws.amazon.com/support/

---

## Commands Reference

```bash
# Local development
npm run dev

# Build locally (test before deployment)
npm run build
npm run start

# Push to trigger deployment
git add .
git commit -m "Your message"
git push origin main

# Check git status
git status

# View remote URL
git remote -v
```

---

**Ready to deploy? Start with Step 1!** 🚀
