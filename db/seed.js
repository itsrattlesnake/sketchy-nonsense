const { client, getAllUsers, createUser } = require("./index");

// this function should call a query which drops all tables from our database
async function createInitialUsers() {
  try {
    console.log("Starting to Create users . . .");
    const albert = await createUser({
      username: "albert",
      password: "bertie99",
    });
    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
    });
  } catch (error) {
    console.error("Error Creating Users!");
    throw error;
  }
}

async function dropTables() {
  try {
    console.log("STARTING TABLE DROP....");
    await client.query(`
        DROP TABLE IF EXISTS users;
      `);

    console.log("Finished Dropping Tables!");
  } catch (error) {
    console.error("Error Dropping Tables X(");
    throw error; // we pass the error up to the function that calls dropTables
  }
}

// this function should call a query which creates all tables for our database
async function createTables() {
  try {
    console.log("STARTING TABLE BUILD....");
    await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            PASSWORD VARCHAR(255) NOT NULL
        );
      `);
    console.log("OPERATION TABLE BUILD COMPLETE");
  } catch (error) {
    console.error("ERROR CONSTRUCTING TABLE");
    throw error; // we pass the error up to the function that calls createTables
  }
}

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
