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
      console.log(`Session is open for ${this.collection}`);
      const database = db.db(dbName);

      var collections = await database.collections();

      var exists = collections.find(
        (x) => x.namespace == `${dbName}.${collection}`
      );
      if (!exists) {
        dbo.createCollection(collection, (err, res) => {
          if (err) {
            throw err;
          }
          console.log("Collection created.");
        });
      }

      this.session = database.collection(collection);
    });

    while (!this.session) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  };

  createDocument = async (doc) => {
    console.log(`Add a documnet to db with id: ${doc.id} with data \n ${doc}`);
    const result = await this.session.insertOne(doc);
    console.log(`${result}`);
  };

  deleteDocument = async (doc) => {
    console.log(`Add a documnet to db with id: ${doc.id} with data \n ${doc}`);
    const result = await this.session.deleteOne(filter =>  filter.id == doc.id);
    console.log(`${result}`);
  };

  getAllDocuments = async () => {
    if (!this.session) {
      this.intialize();
    }
    const options = {};
    const query = {};
    console.log("Logging session" + this.session);
    const cursor = this.session.find(query, options);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    // replace console.dir with your callback to access individual elements
    const documents = [];
    await cursor.forEach((document) => {
      documents.push(document);
    });

    return documents;
  };
}
const username = "sirajurrahman19";
const password = "4Islamabad";
const clusterName = "mydb";
const dbName = "E-Commerce";
let collection = "Users";

module.exports = new mongodbCollection(
  username,
  password,
  clusterName,
  dbName,
  collection
);
