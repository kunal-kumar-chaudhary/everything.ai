import ChatModel from "@/app/model/chat.model";
import MessageModel from "@/app/model/message.model";
import dbConnect from "@/lib/dbConnect";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
// post a message to the database corresponding to a chatid
export async function POST(request: Request) {
  // database connection
  await dbConnect();

  // getting message from the request
  try {
    const requestBody = await request.json();
    const {messages} = requestBody;
    const lastMessage = messages[messages.length - 1].content;
    const url = new URL(request.url);
    const chatIdFromUrl = url.pathname.split("/")[3];

    let chatId = chatIdFromUrl;

    const token = (await cookies()).get("token")?.value;
    console.log(token);
    if (!token) {
      return Response.json(
        {
          sucess: false,
          message: "you're not authenticated..",
        },
        {
          status: 400,
        }
      );
    }

    let userId;

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    userId = (decoded as { id: string }).id;

    // if chatId is "temp" or null, create a new chat
    if (!chatId || chatId === "temp") {
      const newChat = new ChatModel({
        title: "New Chat",
        userId: userId,
        messageCount: 0,
      });

      const savedChat = await newChat.save();
      chatId = <string>savedChat?._id;
    }

    // number of tokens
    const tokens = lastMessage.split(" ").length;
    const userMessage = new MessageModel({
      chatId: chatId,
      role: "user",
      content: lastMessage,
      tokens: tokens,
    });
    await userMessage.save();
    console.log("user message saved to database");

    // sending the message to the LLM
    const chatHistory = await MessageModel.find({ chatId }).sort({
      createdAt: 1,
    });
    const past_messages = chatHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
    console.log("point 3")
    // generating ai response
    const result = await streamText({
      model: google("models/gemini-1.5-flash-latest"),
      messages: past_messages,
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
    console.log("point 4");
    // Create a Response with custom headers and the stream body
    const stream = result.toDataStream();
    
    console.log("creating stream response...");
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Chat-Id': chatId,
        'X-Is-New-Chat': chatIdFromUrl === 'temp' ? 'true' : 'false',
      },
    });
    
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
