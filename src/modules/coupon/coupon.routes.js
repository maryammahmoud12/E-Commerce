import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { validation } from "../../middleware/validation.js";

import * as CC from "./coupon.controller.js";
import * as CV from "./coupon.validation.js";

const couponRouter = Router();

couponRouter.post(
  "/",
  validation(CV.createCoupon),
  auth(systemRoles.admin),
  CC.createCoupon
);

couponRouter.put(
  "/:id",
  validation(CV.updateCoupon),
  auth(systemRoles.admin),
  CC.updateCoupon
);

couponRouter.delete(
  "/:id",
  validation(CV.deleteCoupon),
  auth(systemRoles.admin),
  CC.deleteCoupon
);

couponRouter.get("/", CC.getCoupons);

export default couponRouter;
