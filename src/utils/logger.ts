const log = (category: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${category}] ${message}`, data || "");
};

const error = (category: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.error(`${timestamp} [${category}] ${message}`, data || "");
};

export const logger = { log, error };
