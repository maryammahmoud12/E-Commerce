import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { validation } from "../../middleware/validation.js";

import * as BC from "./brand.controller.js";
import * as BV from "./brand.validation.js";

const brandRouter = Router();

brandRouter.post(
  "/",
  multerHost(validExtensions.image).single("image"),
  validation(BV.createBrand),
  auth(systemRoles.admin),
  BC.createBrand
);

brandRouter.put(
  "/:id",
  multerHost(validExtensions.image).single("image"),
  validation(BV.updateBrand),
  auth(systemRoles.admin),
  BC.updateBrand
);

brandRouter.delete(
  "/:id",
  validation(BV.deleteBrand),
  auth(systemRoles.admin),
  BC.deleteBrand
);

brandRouter.get("/", BC.getBrands);

export default brandRouter;
