const mysql = require('mysql2/promise');
import { seedCourses } from './seedCourses';
import { seedUsers } from './seedUsers';

export async function seedData() {
  try {
    console.log(`⏳ Seeding started ⏳`);
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'course_management',
      password: process.env.DATABASE_PASSWORD ?? 'password!23',
    });

  	await seedUsers(connection);
    await seedCourses(connection);
    return console.log(`✅ All data have been seeded ✅`);
  } catch (e) {
    return console.log(`❌ Error while seeding tables... ❌\n\n${e}`);
  }
}

seedData();
