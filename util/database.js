const mysql = require(`mysql2`);
const pool = mysql.createPool({
  host: `localhost`,
  user: `root`,
  database: `node-complete`,
  password: `123456`,
  port: 3300,
});

module.exports = pool.promise();
