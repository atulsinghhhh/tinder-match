// 'use client';
// import { useEffect, useState } from "react";
// import { pusherClient } from "@/libs/pusherClient";
// import { useParams } from "next/navigation"; 

// type Message = {
//     sender: string;
//     text: string;
//     timestamp: number;
//     roomId: string;
// };

// export default function ChatRoom() {
//     const params = useParams();
//     const roomId = params.roomId as string; 
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState("");

//     useEffect(() => {
//     const channel = pusherClient.subscribe(roomId);

//     channel.bind("new-message", (msg: Message) => {
//         setMessages((prev) => [...prev, msg]);
//         });

//         return () => {
//         pusherClient.unsubscribe(roomId);
//         };
//     }, [roomId]);

//     const sendMessage = async () => {
//     const msg = {
//         roomId,
//         sender: "Atul", // Replace with real user
//         text: input,
//         timestamp: Date.now(),
//         };

//         await fetch("/api/messages", {
//         method: "POST",
//         body: JSON.stringify(msg),
//         });

//         setInput("");
//     };

//     return (
//         <div className="p-4">
//         <div className="h-96 overflow-y-auto border mb-4 p-2 bg-white">
//             {messages.map((m, i) => (
//             <div key={i}>
//                 <strong>{m.sender}:</strong> {m.text}
//             </div>
//             ))}
//         </div>
//         <div className="flex">
//             <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             className="border p-2 flex-1"
//             placeholder="Type a message..."
//             />
//             <button
//             onClick={sendMessage}
//             className="bg-blue-500 text-white px-4 py-2 ml-2"
//             >
//             Send
//             </button>
//         </div>
//         </div>
//     );
// }


'use client';

import { useEffect, useState } from 'react';
import { pusherClient } from '@/libs/pusherClient';
import { useParams } from 'next/navigation';
import { useKindeAuth } from '@kinde-oss/kinde-auth-nextjs';
import { createUser } from '@/app/neo4j.action';
type Message = {
  sender: string;
  text: string;
  timestamp: number;
  roomId: string;
};

export default function ChatRoom() {
  const { user } = useKindeAuth();
  const params = useParams();
  const roomId = params.roomId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
  if (!roomId) return;

  const channel = pusherClient.subscribe(roomId);

  channel.bind("new-message", (msg: Message) => {
    setMessages(prev => {
      // Avoid duplicates if message already exists (optional)
      if (prev.find(m => m.timestamp === msg.timestamp && m.sender === msg.sender)) {
        return prev;
      }
      return [...prev, msg];
    });
  });

  return () => {
    channel.unbind_all();
    pusherClient.unsubscribe(roomId);
  };
}, [roomId]);


  const sendMessage = async () => {
  if (!input.trim()) return;

  const msg = { roomId, sender: user?.given_name || "Unknown", text: input, timestamp: Date.now() };

  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });

    if (res.ok) {
      setInput("");
      // DO NOT add message to state here
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
  <div className="flex flex-col h-screen w-full bg-gray-900 text-white p-4">
    {/* Messages */}
    <div className="flex-grow overflow-y-auto rounded-lg p-4 mb-4 space-y-2">
      {messages.length === 0 ? (
        <p className="text-center text-gray-400 italic">No messages yet.</p>
      ) : (
        messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[15%] px-4 py-2 rounded-2xl text-sm break-words ${
              m.sender === user?.given_name
                ? "bg-pink-500 text-white self-end rounded-tr-none ml-auto"
                : "bg-red-600 text-white self-start rounded-bl-none mr-auto"
            }`}
          >
            <strong className="block text-xs mb-1">{m.sender}</strong>
            <span>{m.text}</span>
            <div className="text-[10px] text-gray-300 mt-1 text-right">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))
      )}
    </div>

    {/* Input + Send Button */}
    <div className="flex gap-3">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow rounded-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
      <button
        onClick={sendMessage}
        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold transition"
      >
        Send
      </button>
    </div>
  </div>
);



}
