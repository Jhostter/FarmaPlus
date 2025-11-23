import { drizzle } from "drizzle-orm/neon-http";
import { products, orders, orderItems } from "@shared/schema";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const db = drizzle(dbUrl, {
  schema: { products, orders, orderItems },
});
