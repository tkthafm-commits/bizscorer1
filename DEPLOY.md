# BizScorer — Deployment Guide

## What This Is
Free AI-powered business audit tool. Feeds leads into Zidly.ai.
URL: bizscorer.com

## Deployment Steps (10 minutes)

### 1. Create GitHub repo
- Go to github.com/new → name it "bizscorer" → create
- Push code:
```bash
cd bizscorer
git init
git add .
git commit -m "BizScorer v1 launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bizscorer.git
git push -u origin main
```

### 2. Deploy on Vercel
- Go to vercel.com → Import repo → Framework: Vite → Deploy

### 3. Add API Key
- Vercel → project → Settings → Environment Variables
- Name: ANTHROPIC_API_KEY
- Value: your key (same one used for zidly.ai)
- Save → Redeploy

### 4. Connect Domain
- Vercel → Settings → Domains → Add "bizscorer.com"
- Add DNS records shown by Vercel to your registrar
- Wait for propagation (5-30 min)

## How It Works
1. User enters business info
2. 5 progressive API calls analyze their presence
3. Scores appear one by one (Google, Website, Social, Competitive, Recommendations)
4. Full report with competitor comparison, revenue estimates, AI-generated fixes
5. Email/WhatsApp capture for PDF download
6. CTA drives to zidly.ai

## Market Detection
- Auto-detects from country selection
- USA / Egypt / Gulf / Western / International
- Scoring weights and recommendations adapt per market

## Cost Per Audit
- 5 API calls × ~$0.05-0.10 each = ~$0.25-0.50 per audit
- At 50 audits/day = ~$12-25/day = ~$375-750/month
- Break-even: 2-4 clients at $97-197/month
