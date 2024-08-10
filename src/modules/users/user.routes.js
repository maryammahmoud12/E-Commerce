import { Router } from "express";
import { validation } from "../../middleware/validation.js";

import * as UC from "./user.controller.js";
import * as UV from "./user.validation.js";

const userRouter = Router();

userRouter.post("/signup", validation(UV.signUp), UC.signUp);
userRouter.get("/confirmEmail/:token", UC.confirmEmail);
userRouter.put("/code", validation(UV.forgetPass), UC.forgetPass);
userRouter.put("/reset", validation(UV.resetPass), UC.resetPass);
userRouter.post("/signin", validation(UV.signIn), UC.signIn);

export default userRouter;
