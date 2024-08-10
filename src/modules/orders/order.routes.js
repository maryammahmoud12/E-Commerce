import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { validation } from "../../middleware/validation.js";

import * as OC from "./order.controller.js";
import * as OV from "./order.validation.js";

const orderRouter = Router();

orderRouter.post(
  "/",
  // validation(OV.createOreder),
  auth(Object.values(systemRoles)),
  OC.createOreder
);

orderRouter.put(
  "/:id",
  validation(OV.cancleOrder),
  auth(Object.values(systemRoles)),
  OC.cancleOrder
);

export default orderRouter;
