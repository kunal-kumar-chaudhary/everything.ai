import { Input } from "../ui/input";
import MessageList from "./message-list";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import {useChat} from "@ai-sdk/react"
import { Button } from "../ui/button";

const ChatComponent = ({ selectedChatId }: { selectedChatId: string | null }) => {
  const router = useRouter();
  
  const { input, handleInputChange, handleSubmit, messages, isLoading } = useChat({
    api: `/api/chat/${selectedChatId || "temp"}/send-message`,
    id: selectedChatId || "temp", // This tells useChat which conversation
    fetch: async (input: string | URL | Request, init: RequestInit | undefined) => {
      const response = await fetch(input, init);
      
      const newChatId = response.headers.get('X-Chat-Id');
      const isNewChat = response.headers.get('X-Is-New-Chat') === 'true';
      
      if (isNewChat && newChatId && newChatId !== selectedChatId) {
        setTimeout(() => {
          router.push(`/chat/${newChatId}`);
        }, 100);
      }
      
      return response;
    },
  });

  console.log("messages", messages);

  return (
    <div className="relative max-h-screen overflow-scroll" id="message-container">
      <div className="sticky top-0 inset-x-0 p-2 h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      <MessageList messages={messages} isLoading={isLoading} />
      
      <form onSubmit={handleSubmit} className="sticky bottom-0 inset-x-0 px-2 py-4">
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button type="submit" className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;