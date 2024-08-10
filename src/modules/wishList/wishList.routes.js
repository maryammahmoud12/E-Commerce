import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { validation } from "../../middleware/validation.js";

import * as WC from "./wishList.controller.js";
import * as WV from "./wishList.validation.js";

const wishListRouter = Router({ mergeParams: true });

wishListRouter.post(
  "/",
  validation(WV.createWishList),
  auth(Object.values(systemRoles)),
  WC.createWishList
);

export default wishListRouter;
