const { MongoClient, ServerApiVersion } = require("mongodb");

class mongodbCollection {
  constructor(username, password, clusterName, dbName, collection) {
    this.username = username;
    this.password = password;
    this.clusterName = clusterName;
    this.dbName = dbName;
    this.collection = collection;
  }

  intialize = async () => {
    const uri = `mongodb+srv://${username}:${password}@${clusterName}.qoynv.mongodb.net/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    client.connect(async (err, db) => {
      const database = db.db(dbName);

      var collections = await database.collections();

      var exists = collections.find(
        (x) => x.namespace == `${dbName}.${collection}`
      );
      if (!exists) {
        database.createCollection(collection, (err, res) => {
          if (err) {
            throw err;
          }
        });
      }

      this.session = database.collection(collection);
    });

    while (!this.session) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  };

  createDocument = async (doc) => {
    const result = await this.session.insertOne(doc);

    return result;
  };

  deleteDocument = async (doc) => {
    console.log(`Deleting item with item ${doc.id}`)

    const result = await this.session.deleteOne({ id: doc.id });

    return result;
  };

  getAllDocuments = async (query) => {
    if (!this.session) {
      this.intialize();
    }
    const options = {};

    const cursor = this.session.find(query, options);

    const documents = [];

    await cursor.forEach((document) => {
      documents.push(document);
    });

    return documents;
  };
}

const username = "sirajurrahman19";
const password = "tm52poe7d1v72tlv";
const clusterName = "mydb";
const dbName = "E-Commerce";
let collection = "ecommerce";

module.exports = new mongodbCollection(
  username,
  password,
  clusterName,
  dbName,
  collection
);
