import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { validation } from "../../middleware/validation.js";

import * as CC from "./cart.controller.js";
import * as CV from "./cart.validation.js";

const cartRouter = Router();

cartRouter.post(
  "/",
  validation(CV.createCart),
  auth(Object.values(systemRoles)),
  CC.createCart
);

cartRouter.put(
  "/",
  validation(CV.removeCart),
  auth(Object.values(systemRoles)),
  CC.removeCart
);

cartRouter.patch(
  "/",
  validation(CV.clearCart),
  auth(Object.values(systemRoles)),
  CC.clearCart
);

export default cartRouter;
