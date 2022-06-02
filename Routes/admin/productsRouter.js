const express = require("express");
const multer = require("multer");
const { handleErrors } = require("./errorMiddleware");
const { handleAuthentication } = require("../authenticationMiddleware");

const productsRepo = require("../../repositories/productsRepository");
const productsNewTemplate = require("../../views/admin/products/new");
const listProductsTemplate = require("../../views/admin/products/index");
const { newProduct } = require("./validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(handleAuthentication);

router.get("/admin/products", async (req, res) => {
  const products = await productsRepo.getAll();

  res.send(listProductsTemplate({ products }));
});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  upload.single("image"),
  newProduct,
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString("base64");

    const { title, price } = req.body;

    await productsRepo.create({ title, price, image });

    res.redirect("/admin/products");
  }
);

module.exports = router;
