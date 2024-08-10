import { Router } from "express";
import { multerHost, validExtensions } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { validation } from "../../middleware/validation.js";

import * as PC from "./product.controller.js";
import * as PV from "./product.validation.js";
import reviewRouter from "../review/review.routes.js";
import wishListRouter from "../wishList/wishList.routes.js";

const productRouter = Router();

productRouter.use("/:productId/review", reviewRouter);
productRouter.use("/:productId/wishlist", wishListRouter);

productRouter.post(
  "/:id",
  multerHost(validExtensions.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 2 },
  ]),
  validation(PV.createProduct),
  auth(systemRoles.admin),
  PC.createProduct
);

productRouter.put(
  "/",
  multerHost(validExtensions.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverImages", maxCount: 2 },
  ]),
  validation(PV.updateProduct),
  auth(systemRoles.admin),
  PC.updateProduct
);

productRouter.get("/", PC.getProducts);

export default productRouter;
