const Repository = require('./repository');

class ProductsRepository extends Repository {
    constructor(){
        super('Products')
      }
}

module.exports = new ProductsRepository();
