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
    <div>
      <div className="messages h-96 overflow-y-auto border p-2 mb-2">
        {messages.length === 0 && <p>No messages yet.</p>}
        {messages.map((m, i) => (
          <div key={i} className={m.sender === user?.given_name ? 'text-right' : 'text-left'}>
            <strong>{m.sender}:</strong> {m.text}
            <div className="text-xs text-gray-500">{new Date(m.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message"
        className="border p-2 w-full mb-2"
      />
      <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  );
}
