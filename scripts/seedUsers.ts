import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import * as fs from 'fs';

const config: Config = {
  dictionaries: [names],
};

export async function seedUsers(connection: any) {
  try {
    console.log(`\n🌱 Seeding users into the database 🌱\n\n`);

    //Seeding users and their courses
    const roles = ['student', 'admin', 'lecturer'];

    let usersInsertQuery = `INSERT INTO users (username, first_name, last_name, password, role) VALUES `;
    let studentInsertQuery = `INSERT INTO student_courses (course_id, student_id, grade) VALUES `;
    let lecturerInsertQuery = `INSERT INTO lecturer_courses (course_id, lecturer_id) VALUES `;

    const userInsertData = [];
    const studentInsertData = [];
    const lecturerInsertData = [];
    let seededCount = 0;
    const userCount = 100000;
    let courseTrack: { [key: string]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let maxNumber = 5;
    for (let i = 0; i < userCount; i++) {
      //Generate first and last name
      const firstName = uniqueNamesGenerator(config);
      const lastName = uniqueNamesGenerator(config);

      const username = `${firstName.toLowerCase().trim()}${lastName
        .toLowerCase()
        .trim()}`;
      const password = 'password123';

      //Get a random role
      const role = roles[Math.floor(Math.random() * roles.length)];

      usersInsertQuery +=
        i !== userCount - 1 ? `(?, ?, ?, ?, ?),` : `(?, ?, ?, ?, ?);`;
      userInsertData.push(...[username, firstName, lastName, password, role]);

      let courseIds = Object.keys(courseTrack);
      let x = 0;

      //Logic to insert values into the lecturer_courses and student_courses tables
      while (x < courseIds.length) {
        const courseId = parseInt(courseIds[x]);
        if (role == 'student') {
          const grade = Math.floor(Math.random() * 70) + 30;

          studentInsertQuery += `(?, ?, ?),`;
          studentInsertData.push(...[courseId, i + 1, grade]);
        } else if (role == 'lecturer') {
          lecturerInsertQuery += `(?, ?),`;
          lecturerInsertData.push(...[courseId, i + 1]);
        }
        courseTrack[courseId.toString()] += 1;

        if (courseTrack[maxNumber] == 10) {
          //refresh hashmap with next 3-5 vals, update maxNumber
          courseTrack = {};
          const coursesNum = Math.floor(Math.random() * 3) + 3;

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
      process.stdout.write(`\r${seededCount} of ${userCount} users seeded...`);
    }

    //execute insert statements
    await connection.query(usersInsertQuery, userInsertData);

    studentInsertQuery = studentInsertQuery.slice(0, -1).concat(';');
    lecturerInsertQuery = lecturerInsertQuery.slice(0, -1).concat(';');

    await connection.query(studentInsertQuery, studentInsertData);
    await connection.query(lecturerInsertQuery, lecturerInsertData);

    // Append SQL to file
    const filePath = '././migrations/1 script.sql';

    fs.appendFileSync(
      filePath,
      `\n${connection.format(usersInsertQuery, userInsertData)}\n`,
    );

    fs.appendFileSync(
      filePath,
      `\n${connection.format(studentInsertQuery, studentInsertData)}\n`,
    );

    fs.appendFileSync(
      filePath,
      `\n${connection.format(lecturerInsertQuery, lecturerInsertData)}\n`,
    );

    return console.log(`\n\n✅ ${userCount} users seeded into the database ✅`);
  } catch (e) {
    return console.log(`\n\n❌ Error while seeding users ❌\n\n${e}`);
  }
}
