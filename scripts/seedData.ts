const mysql = require('mysql2/promise');
import { seedCourses } from './seedCourses';
import { seedUsers } from './seedUsers';
import { config } from 'dotenv';
config();

export async function seedData() {
  try {
    console.log(`⏳ Seeding started ⏳\n`);
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'course_management',
      password: process.env.DATABASE_PASSWORD ?? '@tomic2001',
    });
    await seedCourses(connection);
  	await seedUsers(connection);
    
    return console.log(`\n\n✅ All data have been seeded ✅`);
  } catch (e) {
    return console.log(`❌ Error while seeding tables... ❌\n\n${e}`);
  }
}

seedData();
