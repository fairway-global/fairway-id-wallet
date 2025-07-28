# 💼 Fairway ID Wallet

![Fairway ID Wallet Mockup](https://i.ibb.co/pj6HwCkT/walletiphone-1.png) <!-- Replace `mockup.png` with your actual image file or hosted URL -->

Welcome to the **Fairway ID Wallet** — a secure, mobile-first, and user-friendly digital wallet designed to help you manage your identity and credentials with full control. Built on **Hyperledger Identus** and grounded in **Self-Sovereign Identity (SSI)** principles, this wallet empowers users to own and control their personal data without relying on centralized authorities.

> ⚡ *Get hired 10x faster by securely holding and sharing your credentials.*

---

## 🌟 What is Fairway ID Wallet?

The **Fairway ID Wallet** is an open-source application that allows users to store, manage, and share verifiable credentials. It is built for individuals, developers, and institutions who value privacy, security, and interoperability in identity management.

### 🔥 Key Features

- 🔐 **Secure Credential Storage** – Locally encrypted and user-owned.
- 📱 **Mobile-Optimized Interface** – Designed with a mobile-first philosophy.
- 🛡️ **Identity Verification** – Integration-ready with systems like **Fayda** (Ethiopian National ID).
- 📨 **DIDComm V2 Support** – Enables encrypted, peer-to-peer credential exchange.
- 🔄 **Extensible Integrations** – Connect with verifiers, issuers, and mediators.
- 🌐 **Decentralized** – No central server or data silo.

> This wallet is perfect for managing **professional identities**, **educational credentials**, and more—all in a **user-controlled** environment.

---

## 🛠️ Tech Stack & Architecture

The Fairway ID Wallet is powered by a modern and scalable stack:

| Layer         | Tech Stack                            |
|---------------|----------------------------------------|
| **Frontend**  | ⚛️ React + Next.js                     |
| **State**     | 🧠 Zustand (Global app state)           |
| **UI Kit**    | 🎨 HeroUI                              |
| **SSI Agent** | 🔗 Hyperledger Identus Edge Agent SDK  |
| **Crypto**    | 🔐 SJCL + bip39                        |
| **Storage**   | 🗄️ IndexedDB via `idb-keyval`          |
| **Deploy**    | 🐳 Docker                              |

### ⚙️ Architecture Overview

🖥️ User Interface (Next.js)<br>
⬇️<br>
🧠 Zustand State Stores<br>
⬇️<br>
⚙️ Service Layer (Agent, Wallet, DID Logic)<br>
⬇️<br>
🔗 Hyperledger Identus SDK

---

## 🔐 Security: Your Data, Your Control

Security is at the heart of Fairway ID Wallet:

- 🔑 **Mnemonic Key Management** – Bip39 for key recovery and seed generation.
- 🛡️ **End-to-End Encryption** – Powered by SJCL for all sensitive operations.
- 📡 **Encrypted Communication** – Via DIDComm V2 messaging protocol.
- 🗃️ **Local-Only Storage** – No cloud or central server dependency.

---

## 🚀 Getting Started

Follow these simple steps to run the wallet locally:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/fairway-id-wallet.git
cd fairway-id-wallet
```
### 2. Install dependencies

```bash
npm install
```
### 3. Configure the environment

Edit src/config/index.ts:
``` ts
export const config = {
  MEDIATOR_URL: "https://your-mediator-endpoint.com",
  SECRET_KEY: "your-secret-key",
};
```
### 4. Run the development server

```bash
Copy
npm run dev
```
### 5. Open the app

Visit http://localhost:3000 in your browser.

## 🧠 Why Use Fairway ID Wallet?

🔑 Self-Sovereign – You own your keys and credentials.<br>
📱 Built for Mobile – Fast, sleek, and intuitive UI.<br>
🌍 Open Standards – Based on DIDComm V2 + Hyperledger Identus.<br>
🚀 Capacitor-Ready – Extend to native mobile apps easily.<br>
🔄 Interoperable – Built to connect with the growing identity ecosystem.<br>

## 📖 Learn More

📘 Full Documentation: https://fairway.gitbook.io/docs<br>
🌐 Fairway Official Site: https://fairway.global<br>
💡 Let’s Shape the Future of Decentralized Identity!<br>

Fairway ID Wallet is proudly open source and built with ❤️ by the Fairway team. Whether you're contributing code, reporting issues, or sharing ideas, you're welcome to join the mission.

