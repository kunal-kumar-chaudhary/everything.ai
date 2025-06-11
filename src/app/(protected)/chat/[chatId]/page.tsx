"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import ChatComponent from "@/components/chat/chat-component";
import ChatSidebar from "@/components/chat/chat-sidebar";
import axios from "axios";
import React, { use, useEffect, useState } from "react";

const Page = ({ params }: { params: Promise<{ chatId: string }> }) => {
  const { chatId } = use(params);
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  console.log("chat id inside page.tsx", chatId);
  // fetching all the chats from server
  useEffect(() => {
    const fetchChats = async () => {
      if(!user){
        return;
      }
      try {
        const response = await axios.get(`/api/chat/all-chats/${user?.id}`);
        setChats(response.data.payload);
        console.log(response.data.payload);
      } catch (err) {
        console.log("error fetching chats..");
      }
    };

    fetchChats();
  }, [user]);

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chats={chats} chatId={chatId} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent selectedChatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
