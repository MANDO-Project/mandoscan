#!/bin/bash

# AWS Amplify Deployment - Quick Start Script
# This script helps you push your code to GitHub

echo "🚀 Mandoscan - AWS Amplify Deployment Helper"
echo "=============================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📝 Please provide your GitHub repository URL:"
echo "Example: https://github.com/YOUR_USERNAME/mandoscan.git"
read -p "GitHub URL: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo "❌ Error: GitHub URL is required"
    exit 1
fi

# Check if remote already exists
if git remote | grep -q "origin"; then
    echo "⚠️  Remote 'origin' already exists. Updating..."
    git remote set-url origin "$GITHUB_URL"
else
    echo "🔗 Adding remote origin..."
    git remote add origin "$GITHUB_URL"
fi

echo ""
echo "📋 Checking for changes..."
git status

echo ""
read -p "📦 Add all files and commit? (y/n): " ADD_COMMIT

if [ "$ADD_COMMIT" = "y" ] || [ "$ADD_COMMIT" = "Y" ]; then
    echo "➕ Adding files..."
    git add .
    
    echo ""
    read -p "💬 Commit message (default: 'Initial commit - AWS Amplify deployment'): " COMMIT_MSG
    COMMIT_MSG=${COMMIT_MSG:-"Initial commit - AWS Amplify deployment"}
    
    git commit -m "$COMMIT_MSG"
    echo "✅ Files committed"
fi

echo ""
read -p "🚀 Push to GitHub? (y/n): " PUSH

if [ "$PUSH" = "y" ] || [ "$PUSH" = "Y" ]; then
    echo "⬆️  Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Go to https://console.aws.amazon.com/amplify/"
        echo "2. Click 'New app' → 'Host web app'"
        echo "3. Select GitHub and your repository"
        echo "4. Follow the AWS_AMPLIFY_DEPLOYMENT.md guide"
        echo ""
        echo "📚 Full guide: ./AWS_AMPLIFY_DEPLOYMENT.md"
    else
        echo ""
        echo "❌ Push failed. Please check your GitHub credentials and try again."
        echo "You may need to authenticate with GitHub."
    fi
else
    echo ""
    echo "⏸️  Skipped push. You can push manually later with:"
    echo "   git push -u origin main"
fi

echo ""
echo "🎉 Script complete!"
