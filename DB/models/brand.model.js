import { model, Schema } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
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
    image: {
      secure_url: String,
      public_id: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    customId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const brandModel = model("brand", brandSchema);

export default brandModel;
