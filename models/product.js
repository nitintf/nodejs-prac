const getDb = require('../util/database').getDb;
const mongodb = require('mongodb')
class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? new mongodb.ObjectID(id) : null
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection('product')
        .updateOne({ _id: this._id }, {
          $set: this
        })
    } else {
      dbOp = db
        .collection('product')
        .insertOne(this)
    }

    return dbOp
      .then(result => {
        console.log('result :>> ', result);
      })
      .catch(err => {
        console.log('err :>> ', err);
      })
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('product')
      .find()
      .toArray()
      .then(products => {
        return products
      })
      .catch(err => {
        console.log('err :>> ', err);
      });
  }

  static findById(id) {
    const db = getDb()
    return db
      .collection('product')
      .find({ _id: new mongodb.ObjectID(id) })
      .next()
      .then(product => {
        return product
      })
      .catch(err => {
        console.log('err :>> ', err);
      })
  }

  static deleteById(id) {
    const db = getDb()
    return db
      .collection('product')
      .deleteMany({ _id: new mongodb.ObjectID(id) })
      .then(response => {
        return response
      })
      .catch(err => {
        console.log('err :>> ', err);
      })
  }
}

module.exports = Product;
