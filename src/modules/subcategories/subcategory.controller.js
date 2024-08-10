import categoryModel from "../../../DB/models/category.model.js";
import subCategoryModel from "../../../DB/models/subcategory.model.js";
import cloudinary from "../../utils/cloudinary.js";
import slugify from "slugify";

import { asyncHandler } from "../../middleware/asynchandler.js";
import { appError } from "../../utils/appError.js";
import { nanoid } from "nanoid";
import { apiFeature } from "../../utils/apiFeatures.js";

// add sub category

export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const categoryExist = await categoryModel.findById(req.params.categoryId);
  if (!categoryExist) {
    return next(new appError("category not found", 215));
  }

  const subCategoryExist = await subCategoryModel.findOne({ name });
  if (subCategoryExist) {
    return next(new appError("sub category already exist", 216));
  }

  if (!req.file) {
    return next(new appError("image is required", 217));
  }

  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-commerce/categories/${categoryExist.customId}/subcategories/${customId}`,
    }
  );

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name, { replacement: "_", lower: true }),
    image: { secure_url, public_id },
    customId,
    category: req.params.categoryId,
    createdBy: req.user._id,
  });

  req.data = {
    model: subCategoryModel,
    id: subCategory._id,
  };

  return res.status(218).json({ msg: "done", subCategory });
});

// update sub category

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const categoryExist = await categoryModel.findById(req.params.categoryId);
  if (!categoryExist) {
    return next(new appError("category not found", 219));
  }

  const subCategory = await subCategoryModel.findById({
    _id: id,
    createdBy: req.user._id,
  });
  if (!subCategory) {
    return next(new appError("sub category not found", 220));
  }

  if (name) {
    if (name === subCategory.name) {
      return next(new appError("name should be diffrent", 221));
    }
    if (await subCategoryModel.findOne({ name })) {
      return next(new appError("name already exist", 222));
    }
    subCategory.name = name;
    subCategory.slug = slugify(name, { replacement: "_", lower: true });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    const { secure_url, public_id } = cloudinary.uploader.upload(
      req.file.path,
      { folder: `E-commerce/categories/${subCategory.customId}` }
    );
    subCategory.image = { secure_url, public_id };
  }

  await subCategory.save();
  return res.status(223).json({ msg: "done" });
});

// delete sub category

export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const categoryExist = await categoryModel.findById(req.params.categoryId);
  if (!categoryExist) {
    return next(new appError("category not found", 224));
  }

  const subCategory = await subCategoryModel.findById({
    _id: id,
    createdBy: req.user._id,
  });
  if (!subCategory) {
    return next(new appError("sub category not found", 225));
  }

  await cloudinary.api.delete_resources_by_prefix(
    `E-commerce/categories/${categoryExist.customId}/subcategories/${subCategory.customId}`
  );
  await cloudinary.api.delete_folder(
    `E-commerce/categories/${categoryExist.customId}/subcategories/${subCategory.customId}`
  );

  await subCategory.deleteOne({ _id: id });
  return res.status(225).json({ msg: "done" });
});

// get sub categories

export const getSubCategories = asyncHandler(async (req, res, next) => {
  const subCategory = new apiFeature(categoryModel.find(), req.query)
    .pagination()
    .filter()
    .search();
  return res.status(226).json({ msg: "done", subCategory });
});

// get sub categories with categories

export const getSubCategoriesWithCategories = asyncHandler(
  async (req, res, next) => {
    const subCategory = await subCategoryModel.find({}).populate("category");
    return res.status(227).json({ msg: "done", subCategory });
  }
);
