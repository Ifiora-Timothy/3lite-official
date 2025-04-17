"use server";

export const logToServer = async (...args: any[]) => {
  console.log("Log to server:", ...args);
  // You can also send these logs to your server here
  // Example: await fetch('/api/logs', { method: 'POST', body: JSON.stringify(args) });
};
