import { model, Schema } from "mongoose";
import { systemRoles } from "../../src/utils/systemroles.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    address: [String],
    phone: [String],
    confirmed: {
      type: Boolean,
      default: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    code: String,
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userModel = model("user", userSchema);

export default userModel;
