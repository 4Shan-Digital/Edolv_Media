#!/usr/bin/env node

/**
 * Admin Password Hash Generator
 * 
 * Usage: node scripts/generate-password-hash.mjs <your-password>
 * 
 * Copy the generated hash and set it as ADMIN_PASSWORD_HASH in your .env.local
 */

import { hash } from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('\n❌ Please provide a password as an argument');
  console.error('   Usage: node scripts/generate-password-hash.mjs <your-password>\n');
  process.exit(1);
}

const hashedPassword = await hash(password, 12);

console.log('\n✅ Password hash generated successfully!\n');
console.log('Add this to your .env.local file:\n');
console.log(`ADMIN_PASSWORD_HASH=${hashedPassword}\n`);
