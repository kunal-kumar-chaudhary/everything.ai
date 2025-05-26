"use client";
import ChatComponent from '@/components/chat/chat-component';
import ChatSidebar from '@/components/chat/chat-sidebar';
import React, { useState } from 'react'

// here the user will be redirected after clicking on "new chat" button
const TempChatPage = () => {
  
  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chats={[]} chatId={NaN} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent selectedChatId={NaN} />
        </div>
      </div>
    </div>
  )
}

export default TempChatPage
