import { model, Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    products: [
      {
        title: { type: String, required: true },
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        finalPrice: { type: Number },
      },
    ],
    subPrice: { type: Number, required: true },
    couponCode: { type: Schema.Types.ObjectId, ref: "coupon" },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: ["card", "cash"] },
    status: {
      type: String,
      enum: [
        "placed",
        "waitPayment",
        "delivered",
        "onWay",
        "cancelled",
        "rejected",
      ],
      default: "placed",
    },
    canceledBy: { type: Schema.Types.ObjectId, ref: "user" },
    reason: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const orderModel = model("order", orderSchema);

export default orderModel;
