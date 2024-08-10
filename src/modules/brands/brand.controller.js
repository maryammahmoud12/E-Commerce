import { asyncHandler } from "../../middleware/asynchandler.js";
import { nanoid } from "nanoid";
import { appError } from "../../utils/appError.js";
import { apiFeature } from "../../utils/apiFeatures.js";

import slugify from "slugify";
import brandModel from "../../../DB/models/brand.model.js";
import cloudinary from "../../utils/cloudinary.js";

// add brand

export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const brandExist = await brandModel.findOne({ name });
  if (brandExist) {
    return next(new appError("brand already exist", 228));
  }
  if (!req.file) {
    return next(new appError("image is required", 229));
  }
  const customId = nanoid(5);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `E-commerce/Brands/${customId}`,
    }
  );
  const brand = await brandModel.create({
    name,
    slug: slugify(name, { replacement: "_", lower: true }),
    image: { secure_url, public_id },
    createdBy: req.user._id,
    customId,
  });

  req.data = {
    model: brandModel,
    id: brand._id,
  };
  
  return res.status(230).json({ msg: "done", brand });
});

// update brand

export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  const brand = await brandModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!brand) {
    return next(new appError("brand not found", 231));
  }

  if (name) {
    if (name === brand.name) {
      return next(new appError("name should be diffrent", 232));
    }
    if (await brandModel.findOne({ name })) {
      return next(new appError("name already exist", 233));
    }
    brand.name = name;
    brand.slug = slugify(name, { replacement: "_", lower: true });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { secure_url, public_id } = cloudinary.uploader.upload(
      req.file.path,
      { folder: `E-commerce/b\Brands/${brand.customId}` }
    );
    category.image = { secure_url, public_id };
  }

  await brand.save();
  return res.status(234).json({ msg: "done" });
});

// delete brand

export const deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!brand) {
    return next(new appError("brand not found", 235));
  }
  await cloudinary.api.delete_resources_by_prefix(
    `E-commerce/Brands/${brand.customId}`
  );
  await cloudinary.api.delete_folder(`E-commerce/Brands/${brand.customId}`);
  await brandModel.deleteOne({ _id: id });
  return res.status(236).json({ msg: "done" });
});

// get brands

export const getBrands = asyncHandler(async (req, res, next) => {
  const brand = new apiFeature(brandModel.find(), req.query)
    .pagination()
    .filter()
    .search();
  return res.status(237).json({ msg: "done", brand });
});
