import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemroles.js";
import { validation } from "../../middleware/validation.js";

import * as RC from "./review.controller.js";
import * as RV from "./review.validation.js";

const reviewRouter = Router({ mergeParams: true });

reviewRouter.post(
  "/:orderId",
  validation(RV.createReview),
  auth(Object.values(systemRoles)),
  RC.createReview
);

reviewRouter.delete(
  "/:id",
  validation(RV.deleteReview),
  auth(systemRoles.admin),
  RC.deleteReview
);

export default reviewRouter;
