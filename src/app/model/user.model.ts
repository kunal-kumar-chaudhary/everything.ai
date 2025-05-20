import mongoose, { Schema, Document } from "mongoose";
import { number } from "zod";

// defining user interface
interface User extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  verify_code: string;
  verifyCodeExpiry: Date;
  role: "USER" | "ADMIN";
  usage: {
    totalTokens: number;
    monthlyToken: number;
    lastReset: Date;
  }
}

// preparing shchema of the user model
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [
      /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
      "please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verify_code: {
    type: String,
    required: [true, "verification is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code expiry is required"],
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"], // restricting to USER or ADMIN
    default: "USER", // defaulting to user
  },
  usage: {
    totalTokens: {
      type: Number,
      default: 0
    },
    monthlyToken: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  }
});

// mongoose middleware to update the "updatedAt" field
UserSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
