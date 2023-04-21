const mysql = require('mysql2/promise');
import { seedCourses } from './seedCourses';
import { seedUsers } from './seedUsers';

export async function seedData() {
  try {
    console.log(`⏳ Seeding started ⏳\n\n`);
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'course_management',
      password: process.env.DATABASE_PASSWORD ?? 'password!23',
    });
    await seedCourses(connection);
  	await seedUsers(connection);
    
    return console.log(`\n\n✅ All data have been seeded ✅`);
  } catch (e) {
    return console.log(`❌ Error while seeding tables... ❌\n\n${e}`);
  }
}

seedData();
