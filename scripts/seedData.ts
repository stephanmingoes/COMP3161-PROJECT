import { uniqueNamesGenerator, Config, names } from 'unique-names-generator';

const config: Config = {
  dictionaries: [names],
};

export async function seedData() {
  //Seeding users
  const roles = ['student', 'admin', 'lecturer'];

  for (let i = 0; i < 150000; i++) {
    //Generate first and last name
    const firstName = uniqueNamesGenerator(config);
    const lastName = uniqueNamesGenerator(config);

    const username = `${firstName.toLowerCase().trim()}${lastName
      .toLowerCase()
      .trim()}`;
    const password = 'password123';

    //Get a random role
    const role = roles[Math.floor(Math.random() * roles.length)];

    console.log({
      firstName,
      lastName,
      username,
      password,
      role,
    });
  }
}

seedData();
