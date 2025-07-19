# 💫 MKE-X MD - WhatsApp MultiDevice Bot 💫

<p align="center">
  <img src="https://img.shields.io/github/followers/mKe-BOY99?style=for-the-badge&color=blue">
  <img src="https://img.shields.io/github/stars/mKe-BOY99/MKE-X-MD?style=for-the-badge&color=gold">
  <img src="https://img.shields.io/github/forks/mKe-BOY99/MKE-X-MD?style=for-the-badge&color=purple">
  <img src="https://img.shields.io/github/repo-size/mKe-BOY99/MKE-X-MD?style=for-the-badge&color=green">
  <img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge">
</p>


<a><img src='https://files.catbox.moe/z4do8f.jpeg'/></a>

<a><img src='https://i.imgur.com/LyHic3i.gif'/></a>

## 🚀 Overview

MKE-X MD is a powerful, multi-featured WhatsApp MultiDevice bot built using **Baileys**. It's open source, fast, reliable and constantly updated to support the latest WhatsApp MD updates.

> **Version:** `v2.0-beta`  
> **Language:** JavaScript/Node.js  
> **Author:** [MKE-BOY99](https://github.com/mKe-BOY99)

---

## 🎯 Features

✅ Group Management  
✅ Auto Response  
✅ Sticker Maker  
✅ Downloader (YT, IG, FB, etc.)  
✅ AI Chat (OpenAI)  
✅ Moderation Tools  
✅ Fun Commands  
✅ WhatsApp Channel Support  
✅ Auto Update Workflow

---

## 📲 Deployment Options

### 🔹 TalkDrove (Recommended)

- Easiest method to host bot online for free
- Free 24/7 uptime (with 10 free coins)
- Session & settings form built-in

🔗 Deploy: [https://talkdrove.com/share-bot/66](https://talkdrove.com/share-bot/66)

### 🔹 Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://MKE-X-MKE-BOY99.vercel.app)

---

## 🧠 How To Use

### 1️⃣ Fork This Repository

[![Fork Repo](https://img.shields.io/badge/FORK-MKE--X--MD-blue?style=for-the-badge&logo=github)](https://github.com/mKe-BOY99/MKE-X-MD/fork)

### 2️⃣ Get Session ID

🔗 [Generate Your Pairing Code](https://sessions-muzan-x-md.onrender.com)  
(Use VPN if site doesn't load)

---

## 🛠 How to Deploy on TalkDrove

1. Go to [https://host.talkdrove.com](https://host.talkdrove.com)
2. Create an account & login
3. Go to **Wallet** → Claim **10 Coins**
4. Go to **Deploy** → Find **MKE-X MD**
5. Fill in required settings (use real session)
6. If no deploy button: enable **dark mode**

✅ Bot auto-connects once deployed

---

## 📦 Download Bot Source

[![Download ZIP](https://img.shields.io/badge/Download--Bot--Files-FF009D?style=for-the-badge&logo=github)](https://github.com/mKe-BOY99/MKE-X-MD/archive/refs/heads/main.zip)

---

## 🔄 Auto Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm install
    - run: npm start
```

---

## 📊 Analytics

![Profile View](https://komarev.com/ghpvc/?username=MKE-X-MD&label=VIEWS&style=flat-square&color=blue)
![Visitor Count](https://profile-counter.glitch.me/MKE-X-MD/count.svg)

---

## 📢 Follow & Support

[![WhatsApp Channel](https://img.shields.io/badge/Join-WhatsApp%20Channel-25D366?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029Vb6JYQ81noz7JAjOlg0t)

---

## 🤝 Credits

- Developer: [MKE-BOY99](https://github.com/dawens8)
- Contributors: [All Contributors](https://github.com/mKe-BOY99/MKE-X-MD/graphs/contributors)

> Don't forget to **Star** 🌟 and **Fork** 🍴 this repo if you find it helpful!

