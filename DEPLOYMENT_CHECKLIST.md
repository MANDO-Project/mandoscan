# AWS Amplify Deployment Checklist

## Pre-Deployment Checklist

### Local Setup
- [ ] All code changes committed
- [ ] `.env.local` file configured (not committed)
- [ ] App tested locally with `npm run dev`
- [ ] Build succeeds locally with `npm run build`
- [ ] No TypeScript errors: `npm run lint`

### GitHub Setup
- [ ] GitHub repository created
- [ ] Repository set to Private (recommended)
- [ ] Code pushed to `main` branch
- [ ] `amplify.yml` file in root directory
- [ ] `.env.example` file updated with production values

## AWS Amplify Configuration

### Step 1: Create Amplify App
- [ ] Logged into AWS Console (ap-southeast-1 region)
- [ ] AWS Amplify service opened
- [ ] New app created
- [ ] GitHub connected and authorized
- [ ] Repository and branch selected

### Step 2: Build Settings
- [ ] App name set to `mandoscan`
- [ ] Build settings auto-detected from `amplify.yml`
- [ ] Service role created/selected

### Step 3: Environment Variables
Configure these in Amplify Console:

- [ ] `NEXT_PUBLIC_REDIRECT_URI` = `https://mandoguru.com/dashboard`
- [ ] `NEXT_PUBLIC_COGNITO_AUTHORITY` = `https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_Uu8mUX2F6`
- [ ] `NEXT_PUBLIC_COGNITO_CLIENT_ID` = `6tie9nelelglhhi6polah5ruhc`
- [ ] `SCAN_API_BASE_URL` = `[YOUR_BACKEND_API_URL]`

### Step 4: Initial Deployment
- [ ] Build started
- [ ] Build completed successfully (check logs if failed)
- [ ] Amplify app URL accessible
- [ ] Test Amplify URL: `https://main.xxxxx.amplifyapp.com`

## Custom Domain Configuration

### Step 5: Domain Setup
- [ ] Domain `mandoguru.com` is in Route 53
- [ ] SSL certificate exists in ACM (or will be auto-created)
- [ ] Domain added in Amplify
- [ ] Subdomains configured:
  - [ ] `mandoguru.com` → main branch
  - [ ] `www.mandoguru.com` → main branch
- [ ] SSL certificate status: Active
- [ ] Domain status: Available

## Backend Configuration

### Step 6: Update Backend API
- [ ] Backend API CORS updated with:
  - [ ] `https://mandoguru.com`
  - [ ] `https://www.mandoguru.com`
  - [ ] `https://main.xxxxx.amplifyapp.com`
- [ ] Backend API accessible from internet
- [ ] Backend API URL is HTTPS (or publicly accessible HTTP)

### Step 7: Update Cognito
- [ ] AWS Cognito User Pool opened
- [ ] App client settings updated
- [ ] Callback URLs include:
  - [ ] `https://mandoguru.com/dashboard`
  - [ ] `https://www.mandoguru.com/dashboard`
  - [ ] `https://main.xxxxx.amplifyapp.com/dashboard`
- [ ] Sign-out URLs include:
  - [ ] `https://mandoguru.com`
  - [ ] `https://www.mandoguru.com`
  - [ ] `https://main.xxxxx.amplifyapp.com`

## Testing

### Step 8: Test Deployment
Test on Amplify URL (`https://main.xxxxx.amplifyapp.com`):
- [ ] Homepage loads correctly
- [ ] Login redirects to Cognito
- [ ] Login succeeds and redirects back
- [ ] Dashboard page loads
- [ ] File upload works
- [ ] File list displays
- [ ] Scan button works
- [ ] File detail page loads
- [ ] No console errors in browser DevTools

Test on Custom Domain (`https://mandoguru.com`):
- [ ] Domain resolves correctly
- [ ] HTTPS works (green lock)
- [ ] All functionality works same as Amplify URL
- [ ] `www.mandoguru.com` redirects properly

### Step 9: Monitor Logs
- [ ] Check Amplify build logs for warnings
- [ ] Check browser console for errors
- [ ] Test API calls in Network tab
- [ ] Verify authentication flow completes

## Post-Deployment

### Step 10: Documentation
- [ ] Update README with production URL
- [ ] Document any environment-specific configurations
- [ ] Save Amplify app URL for reference

### Step 11: Monitoring Setup (Optional)
- [ ] CloudWatch Logs enabled
- [ ] Budget alerts configured
- [ ] Performance monitoring set up

### Step 12: Continuous Deployment
- [ ] Test git push triggers auto-deployment
- [ ] Verify deployment notifications work
- [ ] Document rollback procedure

## Troubleshooting Log

If issues occur, document them here:

### Issue 1:
- **Problem:** 
- **Solution:** 
- **Date resolved:** 

### Issue 2:
- **Problem:** 
- **Solution:** 
- **Date resolved:** 

## Important URLs

- **Amplify Console:** https://console.aws.amazon.com/amplify/
- **Amplify App URL:** https://main.xxxxx.amplifyapp.com
- **Production URL:** https://mandoguru.com
- **GitHub Repository:** https://github.com/YOUR_USERNAME/mandoscan
- **Backend API:** [YOUR_API_URL]
- **Cognito Console:** https://console.aws.amazon.com/cognito/
- **Route 53 Console:** https://console.aws.amazon.com/route53/

## Contact Information

- **AWS Account ID:** [YOUR_ACCOUNT_ID]
- **Region:** ap-southeast-1 (Singapore)
- **Cognito User Pool:** ap-southeast-1_Uu8mUX2F6

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Status:** ⬜ In Progress | ⬜ Complete | ⬜ Issues

---

💡 **Tip:** Check off items as you complete them to track your progress!
