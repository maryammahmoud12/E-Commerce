import { Router } from "express";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { validation } from "../../middleware/validation.js";

import * as CC from "./category.controller.js";
import * as CV from "./category.validation.js";
import subCategoryRouter from "../subcategories/subategory.routes.js";

const categoryRouter = Router();

categoryRouter.use("/:categoryId/subCategories", subCategoryRouter);

categoryRouter.post(
  "/",
  multerHost(validExtensions.image).single("image"),
  validation(CV.createCategory),
  auth(systemRoles.admin),
  CC.createCategory
);

categoryRouter.put(
  "/:id",
  multerHost(validExtensions.image).single("image"),
  validation(CV.updateCategory),
  auth(systemRoles.admin),
  CC.updateCategory
);

categoryRouter.delete(
  "/:id",
  validation(CV.deleteCategory),
  auth(systemRoles.admin),
  CC.deleteCategory
);

categoryRouter.get("/", CC.getCategories);

export default categoryRouter;
