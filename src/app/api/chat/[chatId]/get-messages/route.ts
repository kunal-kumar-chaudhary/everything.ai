import MessageModel from "@/app/model/message.model";
import dbConnect from "@/lib/dbConnect";

// get all the messages corresponding to a chat id
export async function GET(request: Request) {
  await dbConnect();

  const url = new URL(request.url);
  const chatId = url.pathname.split("/")[3];

  // getting all the messages
  try{
const messages = await MessageModel.find({ chatId: chatId });
  return Response.json(
    {
      success: true,
      payload: messages,
    },
    {
      status: 200,
    }
  );
  }
  catch(err){
return Response.json({
    success: false,
    message: "error retreving messages"
},{
    status: 500
})
  }
  
}
