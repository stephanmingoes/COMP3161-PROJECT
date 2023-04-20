import { coursesData } from './data';

export async function seedCourses(connection: any) {
  try {
    console.log(`🌱 Seeding courses into the database 🌱`);

    for (const courseCode of Object.keys(coursesData)) {
      //Get course name and generate description
      const courseName = coursesData[courseCode];
      const courseDescription = `This course is for students in year ${
        courseCode[4]
      } that have passed all the courses at year ${
        parseInt(courseCode[4]) - 1
      }. This courses teaches the ${courseName}`;

      const query = `INSERT INTO courses (course_code, course_name, course_description)
                VALUES (?, ?, ?)`;

      await connection.query(query, [
        courseCode,
        courseName,
        courseDescription,
      ]);
    }

    return console.log(
      `✅ ${
        Object.keys(coursesData).length
      } courses seeded into the database ✅`,
    );
  } catch (e) {
    return console.log(`❌ Error while seeding courses ❌\n\n${e}`);
  }
}
