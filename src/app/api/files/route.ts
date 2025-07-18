import FileModel from "@/app/model/file.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  // database connection
  await dbConnect();
  const { fileUrl, userId } = await request.json();

  try {
    const fileDetails = await FileModel.create({
      fileUrl: fileUrl,
      userId: userId,
      uploadDate: Date.now(),
    });

    fileDetails.save();

    return Response.json(
      {
        success: true,
        message: "successfully details saved to database",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return Response.json(
      {
        success: false,
        message: "failed saving detials to the database",
      },
      {
        status: 500,
      }
    );
  }
}
