import UserModel from "@/app/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { signinSchema } from "@/schemas/signinSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  // db connection
  await dbConnect();

  try {
    const body = await request.json();
    const parsedBody = signinSchema.safeParse(body);

    if (!parsedBody.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsedBody.error.format(),
        },
        { status: 400 }
      );
    }

    const { email, password } = parsedBody.data;
    const user = await UserModel.findOne({ email });

    // if user doesn't exists
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "no such user found",
        },
        {
          status: 400,
        }
      );
    }

    // if user exists
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        {
          status: 401,
        }
      );
    }

    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      isVerified: user.isVerified,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    (await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
      sameSite: "strict",
    });

    return Response.json(
      {
        success: true,
        message: "login successful",
        payload,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.error("Sign-in error:", err);
    return Response.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Error signing in",
      },
      { status: 500 }
    );
  }
}
