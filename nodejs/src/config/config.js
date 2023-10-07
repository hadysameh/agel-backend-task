require("dotenv/config");
const username = process.env.DB_USER_NAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const host = process.env.DB_HOST || "localhost";
console.log({ username, password, database, host });
module.exports = {
  development: {
    username,
    password,
    database,
    host,
    dialect: "mysql",
  },
  test: {
    username,
    password,
    database,
    host,
    dialect: "mysql",
  },
  production: {
    username,
    password,
    database,
    host,
    dialect: "mysql",
  },
};
