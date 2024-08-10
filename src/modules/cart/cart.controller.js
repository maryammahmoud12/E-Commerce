import { asyncHandler } from "../../middleware/asynchandler.js";
import { appError } from "../../utils/appError.js";

import productModel from "../../../DB/models/product.model.js";
import cartModel from "../../../DB/models/cart.model.js";

// add cart

export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!product) {
    return next(new appError("product not found", 270));
  }
  const cartExist = await cartModel.findOne({ user: req.user._id });
  if (!cartExist) {
    const cart = await cartModel.create({
      user: req.user._id,
      products: [
        {
          productId,
          quantity,
        },
      ],
    });
    return res.status(271).json({ msg: "done", cart });
  }

  let flag = false;
  for (const product of cartExist.products) {
    if (productId == product.productId) {
      product.quantity = quantity;
      flag = true;
    }
  }
  if (!flag) {
    cartExist.products.push({
      productId,
      quantity,
    });
  }
  await cartExist.save();

  req.data = {
    model: cartModel,
    id: cartExist._id,
  };

  return res.status(272).json({ msg: "done", cart: cartExist });
});

// remove cart

export const removeCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const cartExist = await cartModel.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    { $pull: { products: { productId } } },
    { new: true }
  );
  return res.status(273).json({ msg: "done", cart: cartExist });
});

// clear cart

export const clearCart = asyncHandler(async (req, res, next) => {

  const cartExist = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );

  return res.status(274).json({ msg: "done", cart: cartExist });
});

