const crypto = require("crypto");
const mongodbCollection = require("../repositories/mongodbCollection");
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
    mongodbCollection.createDocument(attrs);
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
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
}

module.exports = new UsersRepository();