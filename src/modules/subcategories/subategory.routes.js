import { Router } from "express";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { validation } from "../../middleware/validation.js";

import * as SCC from "./subcategory.controller.js";
import * as SCV from "./subcategory.validation.js";

const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter.post(
  "/",
  multerHost(validExtensions.image).single("image"),
  validation(SCV.createSubCategory),
  auth(systemRoles.admin),
  SCC.createSubCategory
);

subCategoryRouter.put(
  "/:id",
  multerHost(validExtensions.image).single("image"),
  validation(SCV.updateSubCategory),
  auth(systemRoles.admin),
  SCC.updateSubCategory
);

subCategoryRouter.delete(
  "/:id",
  validation(SCV.deleteSubCategory),
  auth(systemRoles.admin),
  SCC.deleteSubCategory
);

subCategoryRouter.get("/", SCC.getSubCategories);
subCategoryRouter.get("/get", SCC.getSubCategoriesWithCategories);

export default subCategoryRouter;
