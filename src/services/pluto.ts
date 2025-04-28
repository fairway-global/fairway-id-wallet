import SDK from "@hyperledger/identus-edge-agent-sdk";
import Storage from "@pluto-encrypted/indexdb";
import { config } from "@/config";

export const apollo = new SDK.Apollo();
export const castor = new SDK.Castor(apollo);

export const preStart = async () => {
  const dbs = await indexedDB.databases();
  dbs.forEach((db) => {
    if (db.name && db.name === "fairway-wallet") {
      indexedDB.deleteDatabase(db.name);
    }
  });
};

// Helper function to check if a database exists
const databaseExists = async (dbName: string): Promise<boolean> => {
  const dbs = await indexedDB.databases();
  return dbs.some((db) => db.name === dbName);
};

export const connectPluto = async (forceNew = false) => {
  console.log("starting pluto ...");
  const dbName = config.PLUTO_DB_NAME ?? "fairway-wallet";
  console.log(`dbName: ${dbName}`);

  // Only delete the database if forceNew is true and it exists
  if (forceNew) {
    const exists = await databaseExists(dbName);
    console.log(`Database exists: ${exists}`);
    if (exists) {
      await indexedDB.deleteDatabase(dbName);
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Deleted existing database: ${dbName}`);
    }
  }

  const store = new SDK.Store({
    name: config.PLUTO_DB_NAME ?? "fairway-wallet",
    storage: Storage,
    password: Buffer.from(config.PLUTO_PASSWD).toString("hex"),
    // ignoreDuplicate: true,
  });
  console.log("Store initialized with configuration:", store);

  const p = new SDK.Pluto(store, apollo);
  console.log("Pluto instance created:", p);

  if (p.state !== "running") {
    console.log("Pluto not started, starting it now...");
    await p.start();
    console.log("Pluto started successfully.");
  } else {
    console.log("Pluto is already running.");
  }

  return p;
};

export const removeAllDatabases = async () => {
  const dbs = await indexedDB.databases();
  dbs.forEach((db) => {
    db.name ? indexedDB.deleteDatabase(db.name) : null;
  });
};
