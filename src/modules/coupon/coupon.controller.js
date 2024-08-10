import { asyncHandler } from "../../middleware/asynchandler.js";
import { appError } from "../../utils/appError.js";

import couponModel from "../../../DB/models/coupon.model.js";

// add coupon

export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;
  const couponExist = await couponModel.findOne({ code });
  if (couponExist) {
    return next(new appError("coupon already exist", 228));
  }

  const coupon = await couponModel.create({
    code,
    amount,
    fromDate,
    toDate,
    createdBy: req.user._id,
  });

  req.data = {
    model: couponModel,
    id: coupon._id,
  };

  return res.status(230).json({ msg: "done", coupon });
});

// update coupon

export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;
  const { id } = req.params;

  const coupon = await couponModel.findOneAndUpdate(
    {
      _id: id,
      createdBy: req.user._id,
    },
    { code, amount, fromDate, toDate },
    { new: true }
  );
  if (!coupon) {
    return next(
      new appError("coupon not found or you don't have permission", 409)
    );
  }
  return res.status(253).json({ msg: "done", coupon });
});

// delete coupon

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await couponModel.findOne({
    _id: id,
    createdBy: req.user._id,
  });
  if (!coupon) {
    return next(new appError("coupon not found", 235));
  }
  return res.status(236).json({ msg: "done" });
});

// get coupons

export const getCoupons = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.find({});
  return res.status(237).json({ msg: "done", coupon });
});
