import sqlite3WasmUrl from '@sqlite.org/sqlite-wasm/sqlite3.wasm?url';

const wasmFilename = new URL(sqlite3WasmUrl, import.meta.url).pathname.split('/').pop();

globalThis.sqlite3InitModuleState = {
  ...(globalThis.sqlite3InitModuleState ?? {}),
  sqlite3Dir: new URL('.', import.meta.url).href,
  wasmFilename,
};

import '@sqlite.org/sqlite-wasm/dist/sqlite3-worker1.mjs';
