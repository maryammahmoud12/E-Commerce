import { model, Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 20,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "sub category",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "brand",
      required: true,
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    coverImage: [
      {
        secure_url: String,
        public_id: String,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
      type: Number,
      default: 1,
      min: 1,
      max: 100,
    },
    subPrice: {
      type: Number,
      default: 1,
    },
    stock: {
      type: Number,
      default: 1,
      required: true,
    },
    rateAvg: {
      type: Number,
      default: 0,
    },
    rateNum: {
      type: Number,
      default: 0,
    },
    customId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const productModel = model("product", productSchema);

export default productModel;
