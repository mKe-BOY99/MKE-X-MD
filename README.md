<p align="center">
  <h1 align="center">💫 MKE-X MD 💫</h1>
</p>

<p align="center">
<a href="https://github.com/mKe-BOY99/followers"><img title="Followers" src="https://img.shields.io/github/followers/mKe-BOY99?color=blue&style=flat-square"></a>
<a href="https://github.com/mKe-BOY99/MKE-X-MD/stargazers/"><img title="Stars" src="https://img.shields.io/github/stars/mKe-BOY99/MKE-X-MD?color=blue&style=flat-square"></a>
<a href="https://github.com/mKe-BOY99/MKE-X-MD/network/members"><img title="Forks" src="https://img.shields.io/github/forks/mKe-BOY99/MKE-X-MD?color=blue&style=flat-square"></a>
<a href="https://github.com/mKe-BOY99/MKE-X-MD/"><img title="Size" src="https://img.shields.io/github/repo-size/mKe-BOY99/MKE-X-MD?style=flat-square&color=green"></a>
<a href="https://github.com/mKe-BOY99/MKE-X-MD/graphs/commit-activity"><img height="20" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg"></a>&nbsp;&nbsp;
</p>

> **`Current Bot Version ➜ 1.0.0`**
---

```
Dont forget to fork 🍴 & star 🌟 repo😇
```
---

<p align="center">
  <a href="https://github.com/mKe-BOY99">
    <img src="http://readme-typing-svg.herokuapp.com?color=blue&center=true&vCenter=true&multiline=false&lines=MKE-X+MD+MultiDevice;Developed+by+MKE-BOY;Give+star+and+fork+this+Repo+bro+🌟" alt="MKE readme">
  </a>
</p>

--- 

<a><img src=' https://files.catbox.moe/z4do8f.jpeg'/></a>
<a><img src='https://i.imgur.com/LyHic3i.gif'/></a>

***

<p align="center">
  <a href="https://github.com/mKe-BOY99"><img title="Developer" src="https://img.shields.io/badge/Author-MKE%20BOY0-397604.svg?style=for-the-badge&logo=github" /></a>
</p>

<div align="center">
[![WhatsApp Channel](https://img.shields.io/badge/Join-WhatsApp%20Channel-FF00F8?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B)
</div>

<p align="center">
  <img src="https://profile-counter.glitch.me/{MKE-X-MD}/count.svg" alt="mKe-BOY99 :: Visitor's Count" />
</p>

<p align="center">
<a href="https://github.com/mKe-BOY99/MKE-X-MD"><img title="PUBLIC-BOT" src="https://img.shields.io/static/v1?label=Language&message=English&style=flat-square&color=darkpink"></a>
<img src="https://komarev.com/ghpvc/?username=MKE-X-MD&label=VIEWS&style=flat-square&color=blue" />
</p>

<p align="center">
  <a href="https://github.com/mKe-BOY99/MKE-X-MD"><img title="Release" src="https://img.shields.io/badge/Release-beta%20v2.0-darkcyan.svg?style=for-the-badge&logo=appveyor" /></a>
</p>

***

### 1. Fork This Repository

<a href="https://github.com/mKe-BOY99/MKE-X-MD/fork"><img title="MKE-X MD" src="https://img.shields.io/badge/FORK-MKE-X-MD?color=blue&style=for-the-badge&logo=stackshare"></a>

### 2. Get Session ID 

> **1️⃣ Pair Code (Session ID)**

<a href='https://sessions-muzan-x-md.onrender.com' target="_blank">
  <img alt='Pairing Code' src='https://img.shields.io/badge/Get%20Pairing%20Code-orange?style=for-the-badge&logo=opencv&logoColor=black'/>
</a>

---

<h2 align="center">MKE-X MD Deployment Options</h2>

<h4 align="center">1. Heroku</h4>
***[![Deploy on heroku](https://www.herokucdn.com/deploy/button.svg)](https://MKE-X-MKE-BOY99.vercel.app)***

<h4 align="center">2. TalkDrove Free</h4>
<p align="center">
<a href='https://talkdrove.com/share-bot/66' target="_blank"><img alt='TalkDrove' src='https://img.shields.io/badge/-TalkDrove%20Deploy-6971FF?style=for-the-badge&logo=Github&logoColor=white'/></a>
</p>

<details>
<summary align="center">EASIEST METHOD</summary>

<h3 align="center"> HOW TO DEPLOY ON TALKDROVE</h3>
<h6 align="center">
Create Account Here: https://host.talkdrove.com/<br>
Then Login<br>
Claim 10 coins in wallet section<br>
Locate where to deploy your bot<br>
Click next, next until you see MKE-X MD<br>
Fill in session ID and settings, click deploy<br>
Switch to dark mode if deploy button doesn't appear<br>
Done 🎉
</h6>
</details>

### 📦 Download the Bot File

<p align="center">
  <a href="https://github.com/mKe-BOY99/MKE-X-MD/archive/refs/heads/main.zip">
    <img src="https://img.shields.io/badge/Download%20Bot-file-FF009D?style=for-the-badge&logo=github&logoColor=white" alt="Download Bot File" />
  </a>
</p>

### ⚙️ WORKFLOWS

```.github/workflows/deploy.yml```

```yaml
name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm install
      - name: Start application
        run: npm start
```
