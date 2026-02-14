#!/usr/bin/env node

/**
 * Admin Password Hash Generator
 * 
 * ⚠️ SECURITY WARNING:
 * - Only run this script in a secure, local environment
 * - Never commit passwords or hashes to version control
 * - Delete terminal history after running this script
 * - Use a strong, unique password (16+ characters)
 * 
 * Usage: npm run generate-password -- <your-password>
 * Or: node scripts/generate-password-hash.mjs <your-password>
 * 
 * Copy the generated hash and set it as ADMIN_PASSWORD_HASH in your .env.local
 */

import { hash } from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('\n❌ Please provide a password as an argument');
  console.error('   Usage: npm run generate-password -- <your-password>\n');
  process.exit(1);
}

if (password.length < 12) {
  console.warn('\n⚠️  Warning: Password should be at least 12 characters for better security\n');
}

const hashedPassword = await hash(password, 12);

console.log('\n✅ Password hash generated successfully!\n');
console.log('Add this to your .env.local file (note the escaped $ signs):\n');
console.log(`ADMIN_PASSWORD_HASH=${hashedPassword.replace(/\$/g, '\\$')}\n`);
console.log('⚠️  IMPORTANT: Clear your terminal history to remove the plain-text password!\n');
