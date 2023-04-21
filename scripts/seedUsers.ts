import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

const config: Config = {
  dictionaries: [names],
};

export async function seedUsers(connection: any) {
  try {
    console.log(`\n🌱 Seeding users into the database 🌱\n\n`);

    //Seeding users and their courses
    const roles = ['student', 'admin', 'lecturer'];
    
    let insertQuery = `INSERT INTO users (username, first_name, last_name, password, role) VALUES `;
    const insertData = [];
    let seededCount = 0;
    const userCount = 100000;
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

      insertQuery += i!==userCount-1 ? `(?, ?, ?, ?, ?),` : `(?, ?, ?, ?, ?);`;
      insertData.push(...[username, firstName, lastName, password, role]);

      seededCount++;
      process.stdout.write(`\r${seededCount} of ${userCount} users seeded...`);
    }

    //execute insert statements
    await connection.query(insertQuery, insertData);

    return console.log(`\n\n✅ ${userCount} users seeded into the database ✅`);
  } catch (e) {
    return console.log(`❌ Error while seeding users ❌\n\n${e}`);
  }
}
