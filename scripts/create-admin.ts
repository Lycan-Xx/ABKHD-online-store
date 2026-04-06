import { Client, Users, Teams, ID, Query } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Admin User Creation Script
 * 
 * Run with: npx tsx scripts/create-admin.ts <email> <password> <name>
 * 
 * Make sure APPWRITE_ADMIN_KEY is set in your .env file
 */

async function createAdmin() {
  const adminKey = process.env.APPWRITE_ADMIN_KEY;
  
  if (!adminKey) {
    console.error('❌ APPWRITE_ADMIN_KEY is not set. Please add it to your .env file.');
    console.log('Example: APPWRITE_ADMIN_KEY=your_admin_api_key_here');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Usage: npx tsx scripts/create-admin.ts <email> <password> <name>');
    process.exit(1);
  }

  const [email, password, name] = args;

  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.PUBLIC_APPWRITE_PROJECT_ID || '69ae47f1002d446552b3')
    .setKey(adminKey);

  const users = new Users(client);
  const teams = new Teams(client);

  try {
    console.log(`--- Creating Admin User: ${email} ---`);

    // 1. Get or Create User
    let user;
    try {
      const existing = await users.list([
        Query.equal('email', [email])
      ]);
      if (existing.total > 0) {
        user = existing.users[0];
        console.log(`ℹ️ User already exists. Using ID: ${user.$id}`);
      } else {
        user = await users.create(ID.unique(), email, undefined, password, name);
        console.log(`✅ User "${name}" created with ID: ${user.$id}`);
      }
    } catch (e: any) {
      console.error('Failed to create or find user:', e.message);
      throw e;
    }

    // Assign 'admin' label for direct role checking
    try {
      await users.updateLabels(user.$id, ['admin']);
      console.log(`✅ Assigned "admin" label to user.`);
    } catch (e: any) {
      console.warn(`⚠️ Failed to assign label (might not be supported on this Appwrite version): ${e.message}`);
    }

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
    await teams.createMembership(TEAM_ID, ['admin'], email, user.$id, undefined, `${domain}/admin`);
    console.log(`✅ User added to "admin" team.`);

    console.log('\n--- Admin Setup Complete ---');
  } catch (error) {
    console.error('❌ Admin creation failed:', error);
  }
}

createAdmin();
