const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  mongoClient
    .connect('mongodb+srv://nitin:Shadow%400802@nodejs-prac.9z3hb.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
      console.log('DB Connected');
      _db = result.db()
      callback()
    })
    .catch(err => {
      console.log('err :>> ', err);
      throw err;
    })
}

const getDb = () => {
  if (_db) {
    return _db
  }
  throw new Error('No database found')
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
