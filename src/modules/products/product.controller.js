import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";

import { asyncHandler } from "../../middleware/asynchandler.js";
import { appError } from "../../utils/appError.js";
import { nanoid } from "nanoid";
import { apiFeature } from "../../utils/apiFeatures.js";

import productModel from "../../../DB/models/product.model.js";
import categoryModel from "../../../DB/models/category.model.js";
import subCategoryModel from "../../../DB/models/subcategory.model.js";
import brandModel from "../../../DB/models/brand.model.js";

// add product

export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    title,
    stock,
    discount,
    price,
    brand,
    subCategory,
    category,
    description,
  } = req.body;

  const categoryExist = await categoryModel.findById({ _id: category });
  if (!categoryExist) {
    return next(new appError("category not found", 404));
  }

  const subCategoryExist = await subCategoryModel.findById({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist) {
    return next(new appError("sub category not found", 404));
  }

  const brandExist = await brandModel.findById({ _id: brand });
  if (!brandExist) {
    return next(new appError("brand not found", 404));
  }

  const productExist = await productModel.findOne({ title });
  if (productExist) {
    return next(new appError("product already exist", 216));
  }

  const subPrice = price - (price * (discount || 0)) / 100;

  if (!req.files) {
    return next(new appError("image is required", 217));
  }
  const customId = nanoid(5);
  let list = [];
  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `E-commerce/categories/${categoryExist.customId}/subcategories/${subCategoryExist.customId}/products/${customId}`,
      }
    );
    list.push({ secure_url, public_id });
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.image[0].path,
    {
      folder: `E-commerce/categories/${categoryExist.customId}/subcategories/${subCategoryExist.customId}/products/${customId}`,
    }
  );

  const product = await productModel.create({
    title,
    slug: slugify(title, { replacement: "_", lower: true }),
    description,
    price,
    discount,
    subPrice,
    stock,
    category,
    subCategory,
    brand,
    image: { secure_url, public_id },
    coverImages: list,
    customId,
    createdBy: req.user._id,
  });

  req.data = {
    model: productModel,
    id: product._id,
  };

  return res.status(218).json({ msg: "done", product });
});

// update product
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    stock,
    discount,
    price,
    brand,
    subCategory,
    category,
    description,
  } = req.body;

  const categoryExist = await categoryModel.findById({ _id: category });
  if (!categoryExist) {
    return next(new appError("category not found", 404));
  }

  const subCategoryExist = await subCategoryModel.findById({
    _id: subCategory,
    category,
  });
  if (!subCategoryExist) {
    return next(new appError("sub category not found", 404));
  }

  const brandExist = await brandModel.findById({ _id: brand });
  if (!brandExist) {
    return next(new appError("brand not found", 404));
  }

  const productExist = await productModel.findOne({ _id: id });
  if (!productExist) {
    return next(new appError("product not exist", 404));
  }

  if (title) {
    if (title == productExist.title) {
      return next(new appError("title match old title", 404));
    }
    if (await productModel.findOne({ title })) {
      return next(new appError("title already exist", 404));
    }
    productExist.title = title;
    productExist.slug = slugify(title, { lower: true });
  }

  if (description) {
    productExist.description = description;
  }

  if (stock) {
    productExist.stock = stock;
  }

  if (price & discount) {
    productExist.subPrice = price - price * (discount / 100);
    productExist.price = price;
    productExist.discount = discount;
  } else if (price) {
    productExist.subPrice = price - price * (productExist.discount / 100);
    productExist.price = price;
  } else if (discount) {
    productExist.subPrice =
      productExist.price - productExist.price * (discount / 100);
    productExist.discount = discount;
  }

  if (req.files) {
    if (req?.files?.image[0]?.length) {
      await cloudinary.uploader.destroy(productExist.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.image[0].path,
        {
          folder: `E-commerce/categories/${categoryExist.customId}/subcategories/${subCategoryExist.customId}/products/${productExist.customId}`,
        }
      );
    }
    if (req?.files?.coverImages?.length) {
      await cloudinary.api.delete_resources_by_prefix(
        `E-commerce/categories/${categoryExist.customId}/subcategories/${subCategoryExist.customId}/products/${productExist.customId}`
      );
      let list = [];
      for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          {
            folder: `E-commerce/categories/${categoryExist.customId}/subcategories/${subCategoryExist.customId}/products/${productExist.customId}`,
          }
        );
        list.push({ secure_url, public_id });
      }
    }
  }

  await productExist.save();
  return res.json({ msg: "done", productExist });
});

// get products

export const getProducts = asyncHandler(async (req, res, next) => {
  const product = new apiFeature(productModel.find(), req.query)
    .pagination()
    .filter()
    .search()
    .sort()
    .select();
  return res.status(237).json({ msg: "done", product });
});
