import MessageModel from "@/app/model/message.model";
import dbConnect from "@/lib/dbConnect";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
// post a message to the database corresponding to a chatid
export async function POST(request: Request) {
  // database connection
  await dbConnect();

  // getting message from the request
  try {
    const { content } = await request.json();
    const url = new URL(request.url);
    const chatId = url.pathname.split("/")[3];
    // number of tokens
    const tokens = content.split(" ").length;
    const userMessage = new MessageModel({
      chatId: chatId,
      role: "user",
      content: content,
      tokens: tokens,
    });
    await userMessage.save();
    console.log("user message saved to database");

    // sending the message to the LLM
    const chatHistory = await MessageModel.find({ chatId }).sort({
      createdAt: 1,
    });
    const messages = chatHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    console.log("retreived chat historu from the database");
    console.log(messages);
    // generating ai response
    const result = streamText({
      model: google("models/gemini-1.5-flash-latest"),
      messages: messages,
      onError: (error) => {
        console.log(error);
      },
      onFinish: async (completion) => {
        try {
          const assistantMessage = new MessageModel({
            chatId: chatId,
            role: "assistant",
            content: completion.text,
            tokens: completion.text.split(" ").length,
          });
          await assistantMessage.save();
          console.log("assistant message saved into database");
        } catch (err) {
          console.log("db error");
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (err) {
    return Response.json(
      {
        success: false,
        message: "error generating response from LLM",
      },
      {
        status: 500,
      }
    );
  }
}
