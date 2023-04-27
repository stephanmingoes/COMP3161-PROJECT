import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';
import * as fs from 'fs';

const config: Config = {
  dictionaries: [names],
};

export async function seedAdmins(connection: any) {
  try {
    console.log(`\n🌱 Seeding admins into the database 🌱\n\n`);

    //Seeding admins and their courses
    let adminInsertQuery = `INSERT INTO users (username, first_name, last_name, password, role) VALUES `;

    const adminInsertData = [];

    let seededCount = 0;
    const adminCount = 1000;

    for (let i = 0; i < adminCount; i++) {
      //Generate first and last name
      const firstName = uniqueNamesGenerator(config);
      const lastName = uniqueNamesGenerator(config);

      const username = `${firstName.toLowerCase().trim()}${lastName
        .toLowerCase()
        .trim()}`;
      const password = 'password123';

      //Get a random role
      const role = 'admin';

      adminInsertQuery +=
        i !== adminCount - 1 ? `(?, ?, ?, ?, ?),` : `(?, ?, ?, ?, ?);`;
      adminInsertData.push(
        ...[username, firstName, lastName, password, role],
      );

      seededCount++;
      process.stdout.write(
        `\r${seededCount} of ${adminCount} admins seeded...`,
      );
    }

    //execute insert statements
    await connection.query(adminInsertQuery, adminInsertData);

    // Append SQL to file
    const filePath = '././migrations/adminData.sql';

    fs.writeFileSync(
      filePath,
      `/* Admin Insert Data */\n${connection.format(adminInsertQuery, adminInsertData)}\n`,
    );


    return console.log(
      `\n\n✅ ${adminCount} admins seeded into the database ✅`,
    );
  } catch (e) {
    return console.log(`\n\n❌ Error while seeding admins ❌\n\n${e}`);
  }
}
