import { coursesData } from './data';
import * as fs from 'fs';

export async function seedCourses(connection: any) {
  try {
    console.log(`\n🌱 Seeding courses into the database 🌱\n\n`);

    let coursesInsertQuery = `INSERT INTO courses (course_code, course_name, course_description) VALUES `;
    const coursesInsertData = [];

    for (const courseCode of Object.keys(coursesData)) {
      //Get course name and generate description
      const courseName = coursesData[courseCode];
      const courseDescription = `This course is for students in year ${
        courseCode[4]
      } that have passed all the courses at year ${
        parseInt(courseCode[4]) - 1
      }. This courses teaches the ${courseName}`;

      coursesInsertQuery += `(?, ?, ?),`;
      coursesInsertData.push(...[courseCode, courseName, courseDescription]);
    }

    coursesInsertQuery = coursesInsertQuery.slice(0, -1).concat(';');

    await connection.query(coursesInsertQuery, coursesInsertData);

    // Append SQL to file
    const filePath = '././migrations/1 script.sql';

    fs.appendFileSync(
      filePath,
      `\n${connection.format(coursesInsertQuery, coursesInsertData)}\n`,
    );

    return console.log(
      `✅ ${
        Object.keys(coursesData).length
      } courses seeded into the database ✅`,
    );
  } catch (e) {
    return console.log(`❌ Error while seeding courses ❌\n\n${e}`);
  }
}
