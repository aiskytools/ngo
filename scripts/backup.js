// Usage:  npm run backup
// Exports key MongoDB collections to timestamped JSON files under ./backups/<timestamp>/.
// Reads MONGODB_URI from the environment, or parses .env.local if not already set.
//
// Weekly cron (Linux/macOS) example — back up every Sunday at 02:00:
//   0 2 * * 0  cd /path/to/ngo && /usr/bin/npm run backup >> backups/cron.log 2>&1
// Windows: use Task Scheduler to run `npm run backup` in the project directory.

const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

const COLLECTIONS = ["blogs", "stories", "notices", "donations", "contacts", "enquiries"];

function loadEnvLocal() {
  if (process.env.MONGODB_URI) return;
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}

async function main() {
  loadEnvLocal();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set (add it to .env.local or the environment).");
    process.exit(1);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.join(process.cwd(), "backups", stamp);
  fs.mkdirSync(outDir, { recursive: true });

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    console.log(`Backing up database "${db.databaseName}" → backups/${stamp}/`);

    const manifest = { createdAt: new Date().toISOString(), database: db.databaseName, collections: {} };
    for (const name of COLLECTIONS) {
      const docs = await db.collection(name).find({}).toArray();
      fs.writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify(docs, null, 2));
      manifest.collections[name] = docs.length;
      console.log(`  ✓ ${name}: ${docs.length} document(s)`);
    }

    fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
    console.log(`\nBackup complete → ${path.relative(process.cwd(), outDir)}`);
  } catch (err) {
    console.error("Backup failed:", err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
