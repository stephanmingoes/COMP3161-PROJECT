import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import * as fs from 'fs';

const config: Config = {
  dictionaries: [names],
};

export async function seedStudents(connection: any) {
  try {
    console.log(`\n🌱 Seeding students into the database 🌱\n\n`);

    //Seeding students and their courses
    let studentInsertQuery = `INSERT INTO users (username, first_name, last_name, password, role) VALUES `;
    let studentEnrolQuery = `INSERT INTO student_courses (course_id, student_id, grade) VALUES `;

    const studentInsertData = [];
    const studentEnrolData = [];

    let seededCount = 0;
    const studentCount = 100000;
    let courseTrack: { [key: string]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let maxNumber = 5;
    for (let i = 0; i < studentCount; i++) {
      //Generate first and last name
      const firstName = uniqueNamesGenerator(config);
      const lastName = uniqueNamesGenerator(config);

      const username = `${firstName.toLowerCase().trim()}${lastName
        .toLowerCase()
        .trim()}`;
      const password = 'password123';

      //Get a random role
      const role = 'student';

      studentInsertQuery +=
        i !== studentCount - 1 ? `(?, ?, ?, ?, ?),` : `(?, ?, ?, ?, ?);`;
      studentInsertData.push(
        ...[username, firstName, lastName, password, role],
      );

      let courseIds = Object.keys(courseTrack);
      let x = 0;

      //Logic to insert values into the student_courses table
      while (x < courseIds.length) {
        const courseId = parseInt(courseIds[x]);

        const grade = Math.floor(Math.random() * 70) + 30;

        studentEnrolQuery += `(?, ?, ?),`;
        studentEnrolData.push(...[courseId, i + 1, grade]);

        courseTrack[courseId.toString()] += 1;

        if (courseTrack[maxNumber] == 10) {
          //refresh hashmap with next 3-6 vals, update maxNumber
          courseTrack = {};
          const coursesNum = Math.floor(Math.random() * 4) + 3;

          for (let j = 0; j < coursesNum; j++) {
            maxNumber = (maxNumber + 1) % 201;
            if (maxNumber == 0) maxNumber++;
            courseTrack[maxNumber] = 0;
          }
          courseIds = Object.keys(courseTrack);
        }
        x++;
      }

      seededCount++;
      process.stdout.write(
        `\r${seededCount} of ${studentCount} students seeded...`,
      );
    }

    //execute insert statements
    await connection.query(studentInsertQuery, studentInsertData);

    studentEnrolQuery = studentEnrolQuery.slice(0, -1).concat(';');

    await connection.query(studentEnrolQuery, studentEnrolData);

    // Append SQL to file
    const filePath = '././migrations/studentData.sql';

    fs.writeFileSync(
      filePath,
      `/* Student Insert Data */\n${connection.format(studentInsertQuery, studentInsertData)}\n`,
    );

    fs.appendFileSync(
      filePath,
      `\n${connection.format(studentEnrolQuery, studentEnrolData)}\n`,
    );

    return console.log(
      `\n\n✅ ${studentCount} students seeded into the database ✅`,
    );
  } catch (e) {
    return console.log(`\n\n❌ Error while seeding students ❌\n\n${e}`);
  }
}
