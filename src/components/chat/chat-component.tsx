import axios from "axios";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import MessageList from "./message-list";
import { Message } from "@/types/ApiResponse";

const ChatComponent = ({ selectedChatId }: { selectedChatId: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // fetching all the messages dependent on selectedChatId
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Message[]>(
          `/api/chat/${selectedChatId}/get-messages`
        );
        setMessages(response.data);
      } catch (err) {
        console.log("error fatching all then messages");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    getAllMessages();
    
  }, [selectedChatId]);

  // rendering UI on the basis of messages
  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessages = async () => {
    // making a post request for saving the chat at backend
    try {
      const response = await axios.post(
        `/api/chat/${selectedChatId}/send-message`
      );
      setMessages(response.data);
    } catch (err) {
      console.log("error sending message to the server...");
    }
  };

  return (
    <div
      className="relative max-h-screen overflow-scroll"
      id="message-container"
    >
      <div className="sticky top-0 inset-x-0 p-2 h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* displaying all the messages */}
      <MessageList messages={messages} isLoading={isLoading} />
      <form
        onSubmit={handleSendMessages}
        className="sticky bottom-0 inset-x-0 px-2 py-4"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
