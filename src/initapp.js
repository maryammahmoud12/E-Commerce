import connectionDB from "../DB/connectionDb.js";
import * as routers from "./modules/routersmodules.js";
import cors from "cors";

import { deleteFromCloudiniry } from "./middleware/globalCloudineryError.js";
import { appError, globalErrorHandel } from "./utils/appError.js";

export const initApp = (app, express) => {
  app.use(cors());

  app.use(express.json());

  connectionDB();

  app.get("/", (req, res) => {
    res.json({ msg: "hello to my project" });
  });

  app.use("/users", routers.userRouter);
  app.use("/categories", routers.categoryRouter);
  app.use("/subCategories", routers.subCategoryRouter);
  app.use("/brands", routers.brandRouter);
  app.use("/coupon", routers.couponRouter);
  app.use("/product", routers.productRouter);
  app.use("/cart", routers.cartRouter);
  app.use("/order", routers.orderRouter);
  app.use("/review", routers.reviewRouter);
  app.use("/wishlist", routers.wishListRouter);

  app.use("*", (req, res, next) => {
    const err = next(new appError("page not found", 404));
    next(err);
  });

  app.use(globalErrorHandel, deleteFromCloudiniry);
};
