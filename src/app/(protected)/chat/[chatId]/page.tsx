"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import ChatComponent from "@/components/chat/chat-component";
import ChatSidebar from "@/components/chat/chat-sidebar";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

const page = ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);

  // fetching all the chats from server
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`/api/all-chats/${user?.id}`);
        setChats(response.data);
      } catch (err) {
        console.log("error fetching chats..");
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chats={chats} chatId={parseInt(chatId)} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent selectedChatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default page;
