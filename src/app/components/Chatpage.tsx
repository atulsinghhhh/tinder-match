// 'use client';

// import { useEffect, useState, useRef } from "react";
// import io, { Socket } from "socket.io-client";

// type Message = {
//   sender: string;
//   text: string;
//   timestamp: number;
//   room: string;
// };

// type User = {
//   id: string;
//   firstname: string;
// };

// type ChatPageProps = {
//   currentUser: User;
//   applicationId: string;
// };

// export default function ChatPage({ currentUser, applicationId }: ChatPageProps) {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const socketRef = useRef<Socket | null>(null);

//   const roomName = [currentUser.id, applicationId].sort().join("_");

//   useEffect(() => {
//   const socket = io("http://localhost:3000", {
//     path: "/api/socket",
//   });

//   socketRef.current = socket;

//   socket.on("connect", () => {
//     console.log("📡 Connected to socket:", socket.id);
//     socket.emit("join_room", roomName);
//   });

//   socket.on("receive_message", (msg: Message) => {
//     console.log("📩 Received message:", msg);
//     setMessages((prev) => [...prev, msg]); // ✅ safe
//   });

//   return () => {
//     socket.disconnect();
//   };
// }, [roomName]); // ✅ only re-run when room changes

//   const sendMessage = () => {
//     if (!input.trim() || !socketRef.current) return;

//     const msg: Message = {
//       room: roomName,
//       sender: currentUser.firstname,
//       text: input,
//       timestamp: Date.now(),
//     };

//     socketRef.current.emit("send_message", msg);
//     setMessages((prev) => [...prev, msg]);
//     setInput("");
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold">Chat with {applicationId}</h2>
//       <div className="h-[60vh] overflow-y-auto my-4 border p-2 rounded bg-white shadow">
//         {messages.map((m, i) => (
//           <div key={i} className="my-1">
//             <strong>{m.sender}:</strong> {m.text}
//           </div>
//         ))}
//       </div>
//       <div className="flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type a message..."
//           className="border rounded p-2 flex-1"
//         />
//         <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }


// app/chat/page.tsx or wherever your chat component is
'use client';

import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

type Message = {
  sender: string;
  text: string;
  timestamp: number;
  room: string;
};

type User = {
  id: string;
  firstname: string;
};

type ChatPageProps = {
  currentUser: User;
  applicationId: string;
};

export default function ChatPage({ currentUser, applicationId }: ChatPageProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const roomName = [currentUser.id, applicationId].sort().join("_");

  useEffect(() => {
    fetch("/api/socket"); // ✅ Trigger the socket server

    const socket = io("http://localhost:3000", {
      path: "/api/socket",
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("📡 Connected to socket:", socket.id);
      socket.emit("join_room", roomName);
    });

    socket.on("receive_message", (msg: Message) => {
      console.log("📩 Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomName]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const msg: Message = {
      room: roomName,
      sender: currentUser.firstname,
      text: input,
      timestamp: Date.now(),
    };

    socketRef.current.emit("send_message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Chat with {applicationId}</h2>
      <div className="h-[60vh] overflow-y-auto my-4 border p-2 rounded bg-white shadow">
        {messages.map((m) => (
          <div key={`${m.timestamp}_${m.sender}`} className="my-1">
            <strong>{m.sender}:</strong> {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="border rounded p-2 flex-1"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

