import { nanoid } from "nanoid";
import { asyncHandler } from "../../middleware/asynchandler.js";
import { appError } from "../../utils/appError.js";
import { apiFeature } from "../../utils/apiFeatures.js";

import categoryModel from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";
import subCategoryModel from "../../../DB/models/subcategory.model.js";

// add category

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryExist = await categoryModel.findOne({ name });
  if (categoryExist) {
    return next(new appError("category already exist", 206));
  }
  if (!req.file) {
    return next(new appError("image is required", 207));
  }
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-commerce/categories/${customId}`,
    }
  );
  const category = await categoryModel.create({
    name,
    slug: slugify(name, { replacement: "_", lower: true }),
    image: { secure_url, public_id },
    createdBy: req.user._id,
    customId,
  });

  req.data = {
    model: categoryModel,
    id: category._id,
  };

  return res.status(208).json({ msg: "done", category });
});

// update category

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const category = await categoryModel.findById({
    _id: id,
    createdBy: req.user._id,
  });
  if (!category) {
    return next(new appError("category not found", 208));
  }
  if (name) {
    if (name === category.name) {
      return next(new appError("name should be diffrent", 209));
    }
    if (await categoryModel.findOne({ name })) {
      return next(new appError("name already exist", 210));
    }
    category.name = name;
    category.slug = slugify(name, { replacement: "_", lower: true });
  }
  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = cloudinary.uploader.upload(
      req.file.path,
      { folder: `E-commerce/categories/${category.customId}` }
    );
    category.image = { secure_url, public_id };
  }
  await category.save();
  return res.status(211).json({ msg: "done" });
});

// delete category

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await categoryModel.findById({
    _id: id,
    createdBy: req.user._id,
  });
  if (!category) {
    return next(new appError("category not found", 212));
  }
  await subCategoryModel.deleteMany({ category: category._id });
  await cloudinary.api.delete_resources_by_prefix(
    `E-commerce/categories/${category.customId}`
  );
  await cloudinary.api.delete_folder(
    `E-commerce/categories/${category.customId}`
  );
  await categoryModel.deleteOne({ _id: id });
  return res.status(213).json({ msg: "done" });
});

// get categories

export const getCategories = asyncHandler(async (req, res, next) => {
  const category = new apiFeature(categoryModel.find(), req.query)
    .pagination()
    .filter()
    .search();
  return res.status(214).json({ msg: "done", category });
});
