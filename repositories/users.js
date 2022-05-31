const crypto = require("crypto");
const mongodbCollection = require("../repositories/mongodbCollection");
const util = require("util");
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
  async getAll() {
    if (!mongodbCollection.session) {
      await mongodbCollection.intialize();
    }
    return mongodbCollection.getAllDocuments();
  }

  async create(attrs) {
    attrs.id = this.randomId();

    if (!mongodbCollection.session) {
      await mongodbCollection.intialize();
    }

    const salt = crypto.randomBytes(8).toString("hex");
    const buf = await scrypt(attrs.password, salt, 64);

    const user = { ...attrs, password: `${buf.toString("hex")}.${salt}` };

    mongodbCollection.createDocument(user);

    return attrs;
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async comparePassword(saved, supplied) {
    const [hashed, salt] = saved.split(".");
    const hashSupplied = await scrypt(supplied, salt, 64);

    return hashSupplied.toString("hex") === hashed;
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    if (!mongodbCollection.session) {
      await mongodbCollection.intialize();
    }

    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id);
    for (let record of filteredRecords) {
      await mongodbCollection.deleteDocument(record);
    }
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository();
