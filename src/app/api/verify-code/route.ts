import UserModel from "@/app/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  // database connection
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decoded_username = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decoded_username });

    // if there is no user
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 400,
        }
      );
    }

    // if there is user - update the database
    const isCodeValid = user.verify_code === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "account verified successfully",
        },
        {
          status: 200,
        }
      );
    }

    if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "code is expired",
        },
        {
          status: 400,
        }
      );
    }

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "verification code is not valid",
        },
        {
          status: 400,
        }
      );
    }
  } catch (err) {
    return Response.json(
      {
        success: false,
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      },
      {
        status: 500,
      }
    );
  }
}
