import initSqlJs, { Database } from 'sql.js';

let SQL: any = null;
let histDb: Database | null = null;
let pndDb: Database | null = null;

export async function initDatabases() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`
    });
  }

  if (!histDb) {
    const histResponse = await fetch('/data/hist.db');
    const histBuffer = await histResponse.arrayBuffer();
    histDb = new SQL.Database(new Uint8Array(histBuffer));
  }

  if (!pndDb) {
    const pndResponse = await fetch('/data/pnd.db');
    const pndBuffer = await pndResponse.arrayBuffer();
    pndDb = new SQL.Database(new Uint8Array(pndBuffer));
  }

  return { histDb, pndDb };
}

export function getHistDb(): Database | null {
  return histDb;
}

export function getPndDb(): Database | null {
  return pndDb;
}

export function queryHistDb(query: string) {
  if (!histDb) throw new Error('Historical database not initialized');
  return histDb.exec(query);
}

export function queryPndDb(query: string) {
  if (!pndDb) throw new Error('Pending database not initialized');
  return pndDb.exec(query);
}

// Helper to get table names
export function getTableNames(db: Database) {
  const result = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  return result[0]?.values.map(row => row[0]) || [];
}

// Helper to get table schema
export function getTableSchema(db: Database, tableName: string) {
  const result = db.exec(`PRAGMA table_info(${tableName})`);
  return result[0]?.values || [];
}
