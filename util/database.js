// const mysql = require(`mysql2`);
// const { Sequelize } = require(`sequelize`);
// const sequelize = new Sequelize(`node-complete`, `root`, `123456`, {
//   dialect: `mysql`,
//   host: `localhost`,
//   port: 3300,
// });

// module.exports = sequelize; SQL

const mongodb = require(`mongodb`);
let _db;
const MongoClient = mongodb.MongoClient;
const mongoConnect = (callback) => {
  MongoClient.connect(
    `mongodb+srv://peter:88888888@cluster.4rlz1th.mongodb.net/shop?retryWrites=true&w=majority`
  )
    .then((result) => {
      console.log(`Connected`);
      _db = result.db();
      callback(result);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw `No database found!`;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
