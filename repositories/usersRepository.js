const crypto = require("crypto");
const mongodbCollection = require("./mongodbCollection");
const util = require("util");
const repository = require("./repository");
const scrypt = util.promisify(crypto.scrypt);

class usersRepository extends repository {
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

  async comparePassword(saved, supplied) {
    const [hashed, salt] = saved.split(".");
    const hashSupplied = await scrypt(supplied, salt, 64);

    return hashSupplied.toString("hex") === hashed;
  }
}

module.exports = new usersRepository();
