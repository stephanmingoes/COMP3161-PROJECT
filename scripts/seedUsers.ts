import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

const config: Config = {
  dictionaries: [names],
};

export async function seedUsers(connection: any) {
  try {
    console.log(`🌱 Seeding users into the database 🌱`);
    //Seeding users
    const roles = ['student', 'admin', 'lecturer'];
    const userCount = 110000;
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
    }

    return console.log(`✅ ${110000} users seeded into the database ✅`);
  } catch (e) {
    return console.log(`❌ Error while seeding users ❌\n\n${e}`);
  }
}
