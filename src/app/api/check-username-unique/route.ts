import UserModel from "@/app/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  // database connection
  await dbConnect();

  try {
    // getting url from the request
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return Response.json(
        {
          success: false,
          message: "invalid query parameter",
        },
        {
          status: 400,
        }
      );
    }

    const existingVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUsername) {
      return Response.json(
        {
          success: true,
          message: "username is already taken",
        },
        {
          status: 200,
        }
      );
    }

    // in any other case, username must be unique
    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
