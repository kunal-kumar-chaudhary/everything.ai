import UserModel from "@/app/model/user.model";
import dbConnect from "@/lib/dbConnect";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  // db connection
  await dbConnect();

  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    if (!token) {
      return Response.json(
        {
          success: false,
          message: "not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    // if token is present - verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    // fetching the user from the database
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return Response.json(
      { success: false, message: "Authentication failed" },
      { status: 401 }
    );
  }
}
