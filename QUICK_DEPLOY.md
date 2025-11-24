# AWS Amplify Quick Start - TL;DR

## 🚀 Deploy in 5 Steps (30 minutes)

### 1️⃣ Push to GitHub (5 min)
```bash
chmod +x deploy-to-github.sh
./deploy-to-github.sh
```
Or manually:
```bash
git init
git add .
git commit -m "Deploy to AWS Amplify"
git remote add origin https://github.com/YOUR_USERNAME/mandoscan.git
git push -u origin main
```

### 2️⃣ Create Amplify App (10 min)
1. Go to: https://console.aws.amazon.com/amplify/
2. Click "New app" → "Host web app" → Select GitHub
3. Choose repo: `mandoscan`, branch: `main`
4. Add environment variables (see below)
5. Click "Save and deploy"

**Required Environment Variables:**
```
NEXT_PUBLIC_REDIRECT_URI=https://mandoguru.com/dashboard
NEXT_PUBLIC_COGNITO_AUTHORITY=https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_Uu8mUX2F6
NEXT_PUBLIC_COGNITO_CLIENT_ID=6tie9nelelglhhi6polah5ruhc
SCAN_API_BASE_URL=https://your-backend-api.com
```

### 3️⃣ Add Custom Domain (15 min)
1. In Amplify Console → "Domain management"
2. Click "Add domain" → Select `mandoguru.com`
3. Configure: `mandoguru.com` and `www.mandoguru.com` → main branch
4. Wait for SSL certificate (15-30 min)

### 4️⃣ Update Cognito Callbacks (2 min)
Add to Cognito callback URLs:
```
https://mandoguru.com/dashboard
https://www.mandoguru.com/dashboard
https://main.xxxxx.amplifyapp.com/dashboard
```

### 5️⃣ Update Backend CORS (2 min)
Allow origins:
```
https://mandoguru.com
https://www.mandoguru.com
https://main.xxxxx.amplifyapp.com
```

## ✅ Test
- Visit: https://mandoguru.com
- Login, upload, scan

## 🔄 Auto-Deploy
```bash
git push origin main  # Triggers automatic deployment
```

## 💰 Cost
~$15-25/month for light traffic

## 📚 Full Documentation
- **Detailed Guide:** `AWS_AMPLIFY_DEPLOYMENT.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`

## 🆘 Quick Fixes

**Build fails?**
- Check logs in Amplify Console
- Verify environment variables

**Can't login?**
- Check Cognito callback URLs
- Verify environment variables

**API errors?**
- Check backend CORS
- Verify `SCAN_API_BASE_URL`

**Domain not working?**
- Wait 15-30 minutes for SSL
- Check Route 53 DNS records

---

**Ready? Start with Step 1!** 🎯
