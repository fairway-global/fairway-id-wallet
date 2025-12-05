# 💼 Fairway ID Wallet

![Fairway ID Wallet Mockup](https://i.ibb.co/pj6HwCkT/walletiphone-1.png) <!-- Replace `mockup.png` with your actual image file or hosted URL -->

Welcome to the **Fairway ID Wallet** — a secure, mobile-first, and user-friendly digital wallet designed to help you manage your identity and credentials with full control. Built on **Hyperledger Identus** and grounded in **Self-Sovereign Identity (SSI)** principles, this wallet empowers users to own and control their personal data without relying on centralized authorities.

> ⚡ _Get hired 10x faster by securely holding and sharing your credentials._

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
| ------------- | ------------------------------------- |
| **Frontend**  | ⚛️ React + Next.js                    |
| **State**     | 🧠 Zustand (Global app state)         |
| **UI Kit**    | 🎨 HeroUI                             |
| **SSI Agent** | 🔗 Hyperledger Identus Edge Agent SDK |
| **Crypto**    | 🔐 SJCL + bip39                       |
| **Storage**   | 🗄️ IndexedDB via `idb-keyval`         |
| **Deploy**    | 🐳 Docker                             |

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

## 🔗 Fayda Integration

The Fairway ID Wallet integrates with **VeriFayda 2.0 (eSignet)** to enable secure authentication and identity verification using the Ethiopian National ID system. This integration follows the **OpenID Connect (OIDC)** protocol with **PKCE (Proof Key for Code Exchange)** for enhanced security.

### Overview

Fayda integration allows users to authenticate using their Ethiopian National ID credentials and securely share verified identity information. The integration uses:

- **OAuth 2.0 Authorization Code Flow with PKCE** – Enhanced security using `code_verifier` and `code_challenge`
- **Client Assertion JWT** – Client authentication using a signed JWT instead of `client_secret`
- **ID Token & Access Token** – Standard OIDC tokens for authentication and authorization
- **UserInfo Endpoint** – Retrieval of user profile information

### Integration Flow

The Fayda integration follows this flow:

1. **Authorization Request**

   - Generate a random `code_verifier`
   - Create a `code_challenge` using SHA-256 hashing
   - Redirect user to eSignet authorization endpoint with required parameters:
     - `client_id`: Your eSignet Client ID
     - `response_type`: `code`
     - `redirect_uri`: Your callback URL
     - `scope`: `openid profile email` (or `openid` for Yes/No auth)
     - `state`: CSRF protection token
     - `code_challenge`: Base64 URL-encoded SHA-256 hash
     - `code_challenge_method`: `S256`
     - `acr_values`: Optional authentication context requirements (e.g., OTP, biometrics)
     - `claims`: Optional user data requests with essential flags

2. **Callback Handling**

   - Receive authorization code and state from eSignet
   - Validate state for CSRF protection
   - Extract authorization code

3. **Token Exchange**

   - Generate client assertion JWT signed with private key
   - Exchange authorization code for tokens (ID token, access token)
   - Include `code_verifier` in token request
   - Request sent to token endpoint with:
     - `grant_type`: `authorization_code`
     - `code`: Authorization code
     - `redirect_uri`: Callback URL
     - `client_id`: Client ID
     - `client_assertion`: Signed JWT
     - `client_assertion_type`: `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`
     - `code_verifier`: Original code verifier

4. **User Info Retrieval**

   - Use access token to query UserInfo endpoint
   - Receive JWT containing user profile information

5. **JWT Decoding**

   - Decode ID token and UserInfo JWT
   - Extract user claims (name, email, phone, picture, etc.)
   - Handle multi-language claims if `claims_locales` was specified

6. **Rendering User Info**
   - Display decoded user information in the application UI

### Key Parameters

#### Authorization Request Parameters

| Parameter               | Description                         | Example                          |
| ----------------------- | ----------------------------------- | -------------------------------- |
| `client_id`             | Your eSignet Client ID              | `your-client-id`                 |
| `response_type`         | Must be `code`                      | `code`                           |
| `redirect_uri`          | Callback URL after authentication   | `https://yourapp.com/callback`   |
| `scope`                 | OIDC scopes                         | `openid profile email`           |
| `state`                 | CSRF protection token               | Random string                    |
| `code_challenge`        | SHA-256 hash of code_verifier       | Base64 URL-encoded string        |
| `code_challenge_method` | PKCE method                         | `S256`                           |
| `acr_values`            | Authentication context requirements | `mosip:idp:acr:generated-code`   |
| `claims_locales`        | Preferred languages for KYC data    | `en am`                          |
| `claims`                | User data requests                  | JSON object with essential flags |

#### Authentication Context Requirements (acr_values)

- `mosip:idp:acr:generated-code` – OTP authentication only
- `mosip:idp:acr:generated-code:biometrics` – OTP or biometrics authentication

#### Token Request Parameters

| Parameter               | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `grant_type`            | `authorization_code`                                     |
| `code`                  | Authorization code from callback                         |
| `redirect_uri`          | Same as authorization request                            |
| `client_id`             | Your Client ID                                           |
| `client_assertion`      | JWT signed with private key                              |
| `client_assertion_type` | `urn:ietf:params:oauth:client-assertion-type:jwt-bearer` |
| `code_verifier`         | Original code verifier string                            |

### Security Considerations

- **Private Key Protection**: Store the Base64-encoded private key securely (environment variables, not in source code)
- **JWT Expiry**: Set reasonable expiration times (e.g., 2 hours) for client assertion JWTs
- **State Validation**: Always validate the state parameter to prevent CSRF attacks
- **Code Verifier**: Keep the `code_verifier` secure and only send it during token exchange

### Error Handling

Common errors and their meanings:

- `invalid_request` – Invalid authorization code or request parameters
- `invalid_transaction` – Transaction was interrupted
- `invalid_assertion` – Issue with client assertion JWT (check signature, expiry, claims)

### Implementation Example

The token exchange is implemented in `src/app/api/token/route.ts`, which handles:

- Client assertion JWT generation
- Token exchange with eSignet
- Error handling and response parsing

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

```ts
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

## 📋 Testing Documentation

Comprehensive testing documentation is available for Milestone 2 delivery:

📄 [Testing Report](TESTING_REPORT.md) - Complete test cases, results, and testing environment details covering all components including Fayda integration, wallet core functionality, UI components, API routes, and security features.

## 📖 Learn More

📘 Full Documentation: https://fairway.gitbook.io/docs<br>
🌐 Fairway Official Site: https://fairway.global<br>
💡 Let's Shape the Future of Decentralized Identity!<br>

Fairway ID Wallet is proudly open source and built with ❤️ by the Fairway team. Whether you're contributing code, reporting issues, or sharing ideas, you're welcome to join the mission.
