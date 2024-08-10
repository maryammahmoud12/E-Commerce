import { model, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      minLength: 3,
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const reviewModel = model("review", reviewSchema);

export default reviewModel;
