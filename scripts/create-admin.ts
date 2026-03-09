import { Client, Users, Teams, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Admin User Creation Script
 * 
 * Run with: npx tsx scripts/create-admin.ts <email> <password> <name>
 */

async function createAdmin() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Usage: npx tsx scripts/create-admin.ts <email> <password> <name>');
    process.exit(1);
  }

  const [email, password, name] = args;

  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69ae47f1002d446552b3')
    .setKey('standard_2b0bfd9b45717491e84668aeb4f11c9b1545771cb69f5b6f3e4197a2ab945847d27f3768d496fa4fb2fde5d9ecd5941f8bd2e536cfebb3999fc12f5e689f7647face71b8d056deedadd3fd4c52ee00ff014ef4783824746955d0019aaf49b9921b8e0b22eaa1f68c5cdf456920bbead5f20a7359057c30e39678fa2816a22ac3');

  const users = new Users(client);
  const teams = new Teams(client);

  try {
    console.log(`--- Creating Admin User: ${email} ---`);

    // 1. Create User
    const user = await users.create(ID.unique(), email, undefined, password, name);
    console.log(`✅ User "${name}" created with ID: ${user.$id}`);

    // 2. Ensure "admin" team exists
    const TEAM_ID = 'admin';
    let team;
    try {
      team = await teams.get(TEAM_ID);
      console.log(`ℹ️ Team "admin" already exists.`);
    } catch (e: any) {
      if (e.code === 404) {
        team = await teams.create(TEAM_ID, 'Admin');
        console.log(`✅ Team "admin" created.`);
      } else {
        throw e;
      }
    }

    // 3. Add User to Team
    const domain = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';
    await teams.createMembership(TEAM_ID, ['admin'], email, undefined, user.$id, `${domain}/admin`);
    console.log(`✅ User added to "admin" team.`);

    console.log('\n--- Admin Setup Complete ---');
  } catch (error) {
    console.error('❌ Admin creation failed:', error);
  }
}

createAdmin();
