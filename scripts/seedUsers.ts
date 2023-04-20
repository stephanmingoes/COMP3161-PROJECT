import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

const config: Config = {
  dictionaries: [names],
};

export async function seedUsers(connection: any) {
  try {
    console.log(`\n\n🌱 Seeding users into the database 🌱\n\n`);

    //Seeding users and their courses
    const roles = ['student', 'admin', 'lecturer'];
    const courses: { [key: number]: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    const userCount = 100000;
    let maxCourseId = 5;
    let seededCount = 0;
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

      const query = `INSERT INTO users (username, first_name, last_name, password, role)
                VALUES (?, ?, ?, ?, ?)`;

      await connection.query(query, [
        username,
        firstName,
        lastName,
        password,
        role,
      ]);
      
      // Seeding student_courses and lecturer_courses tables
      let coursesCount = 0;
      while(Object.entries(courses))
      for (let courseId=1;courseId<=maxCourseId;courseId++) {
        if (courseId == 222)
          return console.log(`looped through 222 courses`);

        if (courses[courseId] == 10) {
          if(courseId == maxCourseId){
            maxCourseId++;
          }

          //remove key
          delete courses[courseId];

          courses[maxCourseId] = 0;
          continue;
        }

        //insert into relevant table
        const insertionQuery =
          role == 'student' || role == 'admin'
            ? `INSERT INTO student_courses (course_id, student_id)
                VALUES (?, ?)`
            : `INSERT INTO lecturer_courses (course_id, lecturer_id)
                VALUES (?, ?)`;

        await connection.query(insertionQuery, [courseId, i + 1]);

        courses[courseId] += 1;
        coursesCount+=1;
        if(coursesCount==5) break;
      }

      seededCount++;
      process.stdout.write(
        `\r${seededCount} of ${userCount} users seeded...`
      );
   
    }

    return console.log(`\n✅ ${userCount} users seeded into the database ✅`);
  } catch (e) {
    return console.log(`❌ Error while seeding users ❌\n\n${e}`);
  }
}
