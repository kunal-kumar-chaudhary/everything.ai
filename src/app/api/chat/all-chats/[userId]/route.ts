import ChatModel from "@/app/model/chat.model";
import dbConnect from "@/lib/dbConnect";

// get all the chats corresponding to userId
export async function GET(request: Request) {
  // database connection
  await dbConnect();

  const url = new URL(request.url);
  const userId = url.pathname.split("/").pop(); // extracting the last part of path

  if (!userId) {
    return Response.json(
      {
        success: false,
        message: "userId is required!",
      },
      {
        status: 400,
      }
    );
  }

  // fetching all the chats for user
  const chats = await ChatModel.find({ userId }).populate("lastMessage");
  const payload = chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    userId: chat.userId,
    lastMessage: chat.lastMessage,
    updatedAt: chat.updatedAt,
  }));

  return Response.json(
    {
      success: true,
      payload,
    },
    {
      status: 200,
    }
  );
}
