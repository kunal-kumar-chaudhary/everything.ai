import { Input } from "../ui/input";
import MessageList from "./message-list";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { Button } from "../ui/button";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef } from "react";

const ChatComponent = ({ selectedChatId }: { selectedChatId: string | null }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // State to hold the new chat ID during the temp->new transition
  const transitioningChatIdRef = useRef<string | undefined>(undefined);

  const { data: previousMessages, isLoading: isLoadingPreviousMessages } =
    useQuery({
      queryKey: ["chat-messages", selectedChatId],
      queryFn: async () => {
        if (!selectedChatId) {
          return [];
        }
        try {
          const response = await axios.get(
            `/api/chat/${selectedChatId}/get-messages`
          );
          // Ensure payload is an array, default to empty array if not
          return Array.isArray(response.data.payload)
            ? response.data.payload
            : [];
        } catch (error) {
          console.error(
            `Error fetching messages for ${selectedChatId}:`,
            error
          );
          return []; // Return empty array on error
        }
      },
      refetchOnWindowFocus: false,
      enabled: !!selectedChatId // Only run if selectedChatId is valid
    });

  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    isLoading: isLoadingChatResponse,
  } = useChat({
    api: `/api/chat/${selectedChatId || "temp"}/send-message`,
    id: selectedChatId || "temp",
    initialMessages: previousMessages || [],

    onResponse: (res) => {
      const newChatIdHeader = res.headers.get("X-Chat-Id");
      const isNewChatHeader = res.headers.get("X-Is-New-Chat") === "true";
      console.log(newChatIdHeader);
      console.log(isNewChatHeader);
      if (isNewChatHeader && newChatIdHeader && !selectedChatId) {
        transitioningChatIdRef.current = newChatIdHeader;
      }
    },
    onFinish: () => {
      const finalNewChatId = transitioningChatIdRef.current;
      console.log(finalNewChatId);
      if (!selectedChatId && finalNewChatId) {
        queryClient.invalidateQueries({
          queryKey: ["chat-messages", finalNewChatId],
        });
        console.log("redirection place", finalNewChatId)
        router.push(`/chat/${finalNewChatId}`);
      } else if (selectedChatId) {
        queryClient.invalidateQueries({
          queryKey: ["chat-messages", selectedChatId],
        });
      }
    },
    onError: (err) => {
      console.error("useChat Error:", err);
    },
  });

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const displayLoading = isLoadingPreviousMessages || isLoadingChatResponse;

  return (
    <div
      className="relative max-h-screen overflow-scroll"
      id="message-container"
    >
      <div className="sticky top-0 inset-x-0 p-2 h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>
      <MessageList messages={messages} isLoading={displayLoading} />

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4"
      >
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
