import UserModel from "@/app/model/user.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import { signUpSchema } from "@/schemas/signupSchema";
import bcrypt from "bcryptjs";
import {z} from "zod"

export async function POST(request: Request) {
  // database connection
  await dbConnect();

  try {

    const body = await request.json();
    const parsedBody = signUpSchema.parse(body);

    const { username, email, password } = parsedBody

    // case-1: if there is already a verified user present, return error
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        {
          status: 400,
        }
      );
    }

     // case-1: Check if email is already in use by a verified user
     const existingUserVerifiedByEmail = await UserModel.findOne({
        email,
        isVerified: true,
      });
      
      if (existingUserVerifiedByEmail) {
        return Response.json(
          { success: false, message: "Email already in use" },
          { status: 400 }
        );
      }

    // case-2: unverified user exists
    const existingUnverifiedUser = await UserModel.findOne({
      $or: [{ email }, { username }],
      isVerified: false,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // if unverified user exists with the same email, update the existing user account
    if (existingUnverifiedUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUnverifiedUser.password = hashedPassword;
      existingUnverifiedUser.verify_code = verifyCode;
      existingUnverifiedUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
      await existingUnverifiedUser.save();

      // sending verification mail
      await sendVerificationEmail(email, username, existingUnverifiedUser.verify_code);

      return Response.json(
        {
          success: true,
          message: "verification email sent again",
        },
        {
          status: 200,
        }
      );
    }

    // case-3: new user registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verify_code: verifyCode,
      verifyCodeExpiry: new Date(Date.now() + 3600000),
      role: "USER",
    });

    await newUser.save();

    // sending verification mail
    await sendVerificationEmail(email, username, verifyCode);

    return Response.json(
      {
        success: true,
        message: "user registered, please verify your email",
      },
      {
        status: 200,
      }
    );
  } catch (err: unknown) {

    // zod validation errors
    if(err instanceof z.ZodError){
        return Response.json(
            {
                success: false,
                message: "validation failed",
                errors: err.errors
            },
            {
                status: 400
            }
        )
    }

    return Response.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "An unknown error occurred",
      },
      {
        status: 500
      }
    );
  }
}
