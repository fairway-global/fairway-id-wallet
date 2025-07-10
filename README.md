🪪 Fairway ID Wallet
Welcome to the Fairway ID Wallet, a secure and user-friendly digital wallet designed to manage your identity and credentials with ease. Built on top of Hyperledger Identus, this wallet embraces Self-Sovereign Identity (SSI) principles, empowering you with full control over your personal data. Whether you're a developer exploring the tech or an engineer eager to contribute, this README will walk you through the project’s purpose, tech stack, architecture, and setup process. 🚀

🌟 What is Fairway ID Wallet?
The Fairway ID Wallet is an open-source application that enables users to securely store, manage, and share identity credentials. It integrates with decentralized identity systems, leveraging Hyperledger Identus to ensure privacy and security. Here are some standout features:

🔐 Secure Credential Storage: Encrypts and stores your credentials locally on your device.
📱 Mobile-Optimized: Designed with a mobile-first approach for a seamless experience.
🛡️ Identity Verification: Supports verification with systems like Fayda (Ethiopian National ID).
📨 Credential Sharing: Share credentials securely using DIDComm V2 protocols.
🔄 Extensible Integrations: Connects with external services for broader functionality.

This wallet is perfect for managing professional identities, educational credentials, and more—all in a decentralized, user-controlled environment.

🛠️ Tech Stack & Architecture
The Fairway ID Wallet is powered by a modern, robust tech stack tailored for security and scalability. Here’s what drives it:

Frontend: ⚛️ React with Next.jsDelivers a fast, server-rendered UI with an excellent developer experience.
State Management: 🧩 ZustandLightweight and efficient, managing agent, credential, and message states.
UI Components: 🎨 HeroUIProvides a consistent, accessible design system for the interface.
Decentralized Identity: 🔗 Hyperledger Identus Edge Agent SDKHandles DID (Decentralized Identifier) creation, credential management, and secure communication.
Cryptography: 🔑 SJCL (Stanford JavaScript Crypto Library) & bip39Ensures secure encryption and mnemonic seed generation for key management.
Local Storage: 🗄️ IndexedDB (via idb-keyval)Persists wallet data securely on the device.
Containerization: 🐳 DockerSimplifies deployment with a containerized setup.

Architecture Overview
The wallet’s architecture is modular and follows a clean separation of concerns:

UI Layer: Built with React and Next.js, offering a responsive, intuitive interface.
State Management: Zustand stores manage application state (e.g., agent, credentials, messages).
Services: Handle core logic, including DID operations, agent initialization, and Pluto (database) interactions.
Utilities: Provide reusable functions for cryptography, logging, and wallet operations.

Here’s a simplified flow:
[UI] <-> [Zustand Stores] <-> [Services] <-> [Hyperledger Identus SDK]


How it Works: User interactions (e.g., verifying an identity) update the state via Zustand. The services layer then uses the Hyperledger Identus SDK to perform operations like creating DIDs or processing credential offers, all while keeping data secure and local.


🔒 Security: Your Data, Your Control
Security is paramount in the Fairway ID Wallet. Here’s how we protect your data:

🔐 End-to-End Encryption: Sensitive data (e.g., seeds, mnemonics) is encrypted using SJCL.
🛡️ Local Storage: All data stays on your device—no central servers involved.
🔑 Secure Key Management: Generates and recovers seeds via mnemonic phrases with bip39.
📡 DIDComm V2: Ensures encrypted, authenticated communication between parties.


🚀 Getting Started
Ready to explore the Fairway ID Wallet? Follow these steps to set it up locally:

Clone the Repository  
git clone https://github.com/yourusername/fairway-id-wallet.git
cd fairway-id-wallet


Install Dependencies  
npm install


Configure EnvironmentEdit src/config/index.ts to include your settings, such as the mediator URL for Hyperledger Identus. Example:
export const config = {
  MEDIATOR_URL: "https://your-mediator-endpoint.com",
  SECRET_KEY: "your-secret-key",
};

Run the Development Server  
npm run dev


Open the AppVisit http://localhost:3000 in your browser to start using the wallet

Why Use Fairway ID Wallet?

🔑 User Empowerment: You control your data and cryptographic keys.
⚡ Responsive Design: Optimized for mobile with a smooth, fast UI.
📱 Cross-Platform Potential: Web-based now, extendable to mobile apps via tools like Capacitor.
🌍 Standards-Based: Built on DIDComm V2 and Hyperledger Identus for interoperability.

let’s shape the future of decentralized identity! 🌟

Built with ❤️ by the Fairway ID Wallet Team
