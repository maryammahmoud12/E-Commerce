import cloudinary from "../utils/cloudinary.js";

export const deleteFromCloudiniry = async (req, res, next) => {
  if (req.file.path) {
    await cloudinary.api.delete_resources_by_prefix(req.file.path);
    await cloudinary.api.delete_folder(req.file.path);
    next();
  }
};
