import { model, Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 20,
      trim: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    addedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const couponModel = model("coupon", couponSchema);

export default couponModel;
