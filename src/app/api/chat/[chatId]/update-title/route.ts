import ChatModel from "@/app/model/chat.model";
import dbConnect from "@/lib/dbConnect";

// patch endpoint for updating the title specific to a chatid
export async function patch(request: Request) {
  await dbConnect();

  // new title
  const { title } = await request.json();

  const url = new URL(request.url);
  const chatId = url.pathname.split("/")[3];

  try{
const chat = await ChatModel.findByIdAndUpdate(
    { chatId },
    { title: title },
    { new: true }
  );
  return Response.json(
    {
      success: true,
      payload: chat?.title,
    },
    {
      status: 200,
    }
  );
  }
  catch(err){
    return Response.json({
        success: false,
        message: "error updating title for selected chat"
    },
{
    status: 500
})
  }
}
