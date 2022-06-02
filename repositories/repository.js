const mongodbCollection = require("../repositories/mongodbCollection");
const util = require("util");
const crypto = require("crypto");
class repository {
  constructor(docType) {
    this.docType = docType;
  }

  async getAll() {
    if (!mongodbCollection.session) {
      await mongodbCollection.intialize();
    }
    return mongodbCollection.getAllDocuments();
  }

  async create(attrs) {
    attrs.id = this.randomId();
    attrs.docType = this.docType;

    if (!mongodbCollection.session) {
      await mongodbCollection.intialize();
    }

    mongodbCollection.createDocument(attrs);

    return attrs;
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id && record.docType === this.docType);
  }

  async delete(id) {
    if (!mongodbCollection.session) {
      await mongodbCollection.intialize();
    }

    const records = await this.getAll();
    const filteredRecords = records.filter((record) => record.id !== id && record.docType === this.docType);
    for (let record of filteredRecords) {
      await mongodbCollection.deleteDocument(record);
    }
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    const filteredRecords = records.filter((record) => record.docType === this.docType);
    
    for (let record of filteredRecords) {
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

module.exports = repository;
