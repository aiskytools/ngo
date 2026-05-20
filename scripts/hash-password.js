// Usage:  node scripts/hash-password.js "yourPlainTextPassword"
// Copy the printed hash into .env.local as ADMIN_PASSWORD_HASH.

const bcrypt = require("bcryptjs");

const pw = process.argv[2];
if (!pw) {
  console.error("Usage: node scripts/hash-password.js \"yourPassword\"");
  process.exit(1);
}

const hash = bcrypt.hashSync(pw, 10);
console.log(hash);
