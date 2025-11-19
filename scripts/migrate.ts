#!/usr/bin/env deno run --allow-read --allow-write

import { Database } from "sqlite";
import { ensureDir } from "$std/fs/mod.ts";

const DB_PATH = "./data/maths-wizards.db";

console.log("Running database migrations...");

// Ensure data directory exists
await ensureDir("./data");

// Create database connection
const db = new Database(DB_PATH);

try {
  // Read and execute schema
  const schema = await Deno.readTextFile("./db/schema.sql");

  // Execute the entire schema at once
  // SQLite can handle multiple statements in a single exec() call
  db.exec(schema);

  console.log("✓ Database schema created successfully");
  console.log(`✓ Database location: ${DB_PATH}`);

  // Verify tables were created
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`✓ Created ${tables.length} tables`);
} catch (error) {
  console.error("Migration failed:", error);
  Deno.exit(1);
} finally {
  db.close();
}
