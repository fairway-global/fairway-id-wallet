// Server URLs

// export const CLOUD_PROXY_URL = "https://vm.fairway.global/node";
export const MEDIATOR_URL = "https://vm.fairway.global/mediator";
export const CLOUD_AGENT_URL = "https://vm.fairway.global/agent";

export const ISSUER_DID =
  "did:prism:48c252d32b349f70794f518d6aa412525018b3ac3f2a78bbc5107a49abf183bc";
export const IDENTITY_SCHEMA_ID = "a163967-1836-4e29-8aa6-97518abaa597";
export const AGENT_PRSIM_DID_NAME = "Master-Agent-DID-Fairway-Wallet";

// DID and Agent Config
export const DID_METHOD = "prism";
export const STORAGE_DB_NAME = "fairway-wallet";

// Credential Types
export const CREDENTIAL_TYPES = {
  DIGITAL_ID: "DigitalIdentity",
  EDUCATION: "EDUCATION",
};

// App Routes
export const ROUTES = {
  WELCOME: "/",
  SETUP: "/setup",
  SIGNIN: "/signin",
  DASHBOARD: "/dashboard",
  CREDENTIAL_DETAIL: "/credential",
  MESSAGES: "/messages",
  RECOVER: "/recover",
  BACKUP_RESTORE: "/backup-and-restore",
};

// Storage Keys
export const STORAGE_KEYS = {
  WALLET: "fairway-wallet-storage",
  AGENT: "fairway-agent",
};

export const APP_VERSION = "1.0.0";
export const config = {
  ENV: process.env.REACT_APP_ENV || "development",
  DEBUG: process.env.REACT_APP_DEBUG === "true" ? true : false,
  SECRET_KEY: process.env.REACT_APP_SECRET_KEY || "BETAMWESANMISTIR",
  PLUTO_PASSWD: new Uint8Array(32).fill(
    parseInt(process.env.REACT_APP_PLUTO_PASSWD || "0") || 0
  ),
  PLUTO_DB_NAME: process.env.REACT_APP_PLUTO_DB_NAME,
  MEDIATOR_DID: process.env.REACT_APP_MEDIATOR_DID || "did:example:mediator",
  ISSUER_AGENT: process.env.REACT_APP_ISSUER_AGENT,
  BACKUP_AGENT: process.env.REACT_APP_BACKUP_AGENT,
  BACKUP_AGENT_API_KEY: process.env.REACT_APP_BACKUP_AGENT_API_KEY,
  FAYDA_API_KEY: process.env.REACT_APP_VERIFF_API_KEY,
  PLATFORM: process.env.REACT_APP_PLATFORM,
  DATADOG_APP_ID: process.env.REACT_APP_DATADOG_APP_ID,
  DATADOG_CLIENT_TOKEN: process.env.REACT_APP_DATADOG_CLIENT_TOKEN,
  LOCAL_STORAGE_NAME:
    process.env.REACT_APP_LOCAL_STORAGE_NAME || "fairway-wallet-storage",
};
