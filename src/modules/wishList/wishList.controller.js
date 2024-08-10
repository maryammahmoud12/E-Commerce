import { asyncHandler } from "../../middleware/asynchandler.js";
import { appError } from "../../utils/appError.js";

import productModel from "../../../DB/models/product.model.js";
import wishListModel from "../../../DB/models/wishList.model.js";

// add wishlist

export const createWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new appError("product not found", 295));
  }

  const wishListExist = await wishListModel.findOne({
    user: req.user._id,
  });
  if (!wishListExist) {
    const wishList = await wishListModel.create({
      user: req.user._id,
      products: [productId],
    });
    return res.status(200).json({ msg: "done", wishList });
  }
  await wishListModel.updateOne(
    { user: req.user._id },
    { $addToSet: { products: productId } }
  );

  req.data = {
    model: wishListModel,
    id: wishListExist._id,
  };

  return res.status(201).json({ msg: "done", wishList });
});

// delete review
