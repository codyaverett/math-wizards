// Database connection and wrapper
// Provides a singleton database connection for the application

import { Database } from "sqlite";
import { config } from "../config.ts";

let db: Database | null = null;

/**
 * Get or create database connection
 * Returns a singleton instance
 */
export function getDb(): Database {
  if (!db) {
    db = new Database(config.database.path);
    // Enable foreign keys
    db.exec("PRAGMA foreign_keys = ON");
  }
  return db;
}

/**
 * Close database connection
 * Call this when shutting down the application
 */
export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Execute a query and return all results
 */
export function query<T = unknown>(sql: string, params: unknown[] = []): T[] {
  const database = getDb();
  const stmt = database.prepare(sql);
  const results = stmt.all(...params) as T[];
  stmt.finalize();
  return results;
}

/**
 * Execute a query and return a single result
 */
export function queryOne<T = unknown>(sql: string, params: unknown[] = []): T | null {
  const database = getDb();
  const stmt = database.prepare(sql);
  const result = stmt.get(...params) as T | undefined;
  stmt.finalize();
  return result ?? null;
}

/**
 * Execute a statement (INSERT, UPDATE, DELETE)
 * Returns the number of affected rows
 */
export function execute(sql: string, params: unknown[] = []): number {
  const database = getDb();
  const stmt = database.prepare(sql);
  stmt.run(...params);
  const changes = database.changes;
  stmt.finalize();
  return changes;
}

/**
 * Get the last inserted row ID
 */
export function lastInsertId(): number {
  const database = getDb();
  return database.lastInsertRowId;
}

/**
 * Execute multiple statements in a transaction
 */
export function transaction<T>(fn: () => T): T {
  const database = getDb();
  database.exec("BEGIN TRANSACTION");
  try {
    const result = fn();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

/**
 * Increment view count for a table
 */
export function incrementViewCount(table: string, id: number): void {
  execute(
    `UPDATE ${table} SET view_count = view_count + 1 WHERE id = ?`,
    [id]
  );
}
