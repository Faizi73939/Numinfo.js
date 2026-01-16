# 🔥 NUMINFO ULTRA (Playwright Edition)

Real browser based SIM information lookup tool using Playwright.

## ✨ Features
- Real Chromium browser (anti-bot safe)
- Bulk number search
- TXT + CSV export
- Headless support
- Human-like delays
- Termux supported via Ubuntu (proot)

## 🛠 Requirements
- Termux
- proot-distro Ubuntu
- Node.js
- Playwright

## 🚀 Install
```bash
npm install
npx playwright install chromium
#################################################
# STEP 1 — TERMUX SETUP (F-Droid VERSION ONLY)
#################################################

pkg update && pkg upgrade -y
pkg install proot-distro git -y

#################################################
# STEP 2 — INSTALL UBUNTU (PROOT)
#################################################

proot-distro install ubuntu

#################################################
# STEP 3 — LOGIN INTO UBUNTU
#################################################

proot-distro login ubuntu

#################################################
# STEP 4 — UPDATE UBUNTU
#################################################

apt update && apt upgrade -y

#################################################
# STEP 5 — INSTALL BASIC TOOLS
#################################################

apt install -y curl git nodejs npm python3 python3-pip

#################################################
# STEP 6 — CREATE PLAYWRIGHT PROJECT
#################################################

mkdir test-playwright
cd test-playwright
npm init -y
npm install playwright

#################################################
# STEP 7 — INSTALL CHROMIUM
#################################################

npx playwright install chromium

#################################################
# STEP 8 — FIX DPKG (IF ERROR APPEARS)
#################################################

dpkg --configure -a
apt --fix-broken install -y
apt update

#################################################
# STEP 9 — INSTALL PLAYWRIGHT SYSTEM DEPENDENCIES
#################################################

apt install -y \
  libnspr4 \
  libnss3 \
  libatk1.0-0t64 \
  libatspi2.0-0t64 \
  libxdamage1 \
  libxcomposite1 \
  libxrandr2 \
  libgbm1 \
  libasound2t64 \
  libdrm2 \
  libxfixes3 \
  libxkbcommon0

#################################################
# STEP 10 — FINAL PLAYWRIGHT TEST
#################################################

node - <<'EOF'
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  console.log("✅ Chromium launched successfully");
  await browser.close();
})();
EOF
