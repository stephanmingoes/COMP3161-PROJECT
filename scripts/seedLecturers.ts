import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import * as fs from 'fs';

const config: Config = {
  dictionaries: [names],
};

export async function seedLecturers(connection: any) {
  try {
    console.log(`\n🌱 Seeding lecturer into the database 🌱\n\n`);

    //Seeding lecturers and their courses
    let lecturerInsertQuery = `INSERT INTO users (username, first_name, last_name, password, role) VALUES `;
    let lecturerEnrolQuery = `INSERT INTO lecturer_courses (course_id, lecturer_id) VALUES `;

    const lecturerInsertData = [];
    const lecturerEnrolData = [];

    let seededCount = 0;
    const lecturerCount = 20000;
    let courseTrack: { [key: string]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    let maxNumber = 5;
    for (let i = 0; i < lecturerCount; i++) {
      //Generate first and last name
      const firstName = uniqueNamesGenerator(config);
      const lastName = uniqueNamesGenerator(config);

      const username = `${firstName.toLowerCase().trim()}${lastName
        .toLowerCase()
        .trim()}`;
      const password = 'password123';

      //Get a random role
      const role = 'lecturer';

      lecturerInsertQuery +=
        i !== lecturerCount - 1 ? `(?, ?, ?, ?, ?),` : `(?, ?, ?, ?, ?);`;
      lecturerInsertData.push(
        ...[username, firstName, lastName, password, role],
      );

      let courseIds = Object.keys(courseTrack);
      let x = 0;

      //Logic to insert values into the lecturer_courses table
      while (x < courseIds.length) {
        const courseId = parseInt(courseIds[x]);

        lecturerEnrolQuery += `(?, ?),`;
        lecturerEnrolData.push(...[courseId, i + 1]);

        courseTrack[courseId.toString()] += 1;

        if (courseTrack[maxNumber] == 10) {
          //refresh hashmap with next 1-5 vals, update maxNumber
          courseTrack = {};
          const coursesNum = Math.floor(Math.random() * 5) + 1;

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
        `\r${seededCount} of ${lecturerCount} lecturers seeded...`,
      );
    }

    //execute insert statements
    await connection.query(lecturerInsertQuery, lecturerInsertData);

    lecturerEnrolQuery = lecturerEnrolQuery.slice(0, -1).concat(';');

    await connection.query(lecturerEnrolQuery, lecturerEnrolData);

    // Append SQL to file
    const filePath = '././migrations/lecturerData.sql';

    fs.writeFileSync(
      filePath,
      `/* Lecturer Insert Data */\n${connection.format(lecturerInsertQuery, lecturerInsertData)}\n`,
    );

    fs.appendFileSync(
      filePath,
      `\n${connection.format(lecturerEnrolQuery, lecturerEnrolData)}\n`,
    );

    return console.log(
      `\n\n✅ ${lecturerCount} lecturers seeded into the database ✅`,
    );
  } catch (e) {
    return console.log(`\n\n❌ Error while seeding lecturers ❌\n\n${e}`);
  }
}
