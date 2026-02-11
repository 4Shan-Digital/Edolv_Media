#!/usr/bin/env node

/**
 * Password Hash Tester
 * 
 * Usage: node scripts/test-password.mjs <password> <hash>
 * 
 * Tests if a password matches a given bcrypt hash
 */

import { compare } from 'bcryptjs';

const password = process.argv[2];
const hash = process.argv[3];

if (!password || !hash) {
  console.error('\n❌ Please provide both password and hash as arguments');
  console.error('   Usage: node scripts/test-password.mjs <password> <hash>\n');
  console.error('   Example: node scripts/test-password.mjs "Himanshu@123" "$2b$12$abc..."\n');
  process.exit(1);
}

console.log('\n🔍 Testing password hash...\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('Hash length:', hash.length);
console.log('Hash prefix:', hash.substring(0, 7));

try {
  const isMatch = await compare(password, hash);
  
  if (isMatch) {
    console.log('\n✅ Password matches the hash!\n');
  } else {
    console.log('\n❌ Password does NOT match the hash!\n');
  }
} catch (error) {
  console.error('\n❌ Error during comparison:', error.message);
  console.error('Make sure the hash is a valid bcrypt hash.\n');
}
