// // pages/api/socket.ts
// import { Server as IOServer } from "socket.io";
// import { Server as HTTPServer } from "http";
// import type { NextApiRequest } from "next";
// import type { NextApiResponseWithSocket } from "@/types/index";
// import { createMessage } from "@/app/neo4j.action";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
//   if (!res.socket?.server.io) {
//     console.log("🔌 Initializing Socket.IO server...");

//     const io = new IOServer(res.socket.server as HTTPServer, {
//       path: "/api/socket",
//       addTrailingSlash: false,
//     });

//     res.socket.server.io = io;

//     io.on("connection", (socket) => {
//       console.log("✅ Connected:", socket.id);

//       socket.on("join_room", (room) => {
//         socket.join(room);
//         console.log(`📥 Joined room: ${room}`);
//       });

//       socket.on("send_message", async (msg) => {
//         console.log(`💬 ${msg.sender} in room ${msg.room}: ${msg.text}`);
//         socket.to(msg.room).emit("receive_message", msg);

//         try {
//           await createMessage(msg.room, msg.sender, msg.text, msg.timestamp);
//         } catch (error) {
//           console.error("❌ DB error:", error);
//         }
//       });

//       socket.on("disconnect", () => {
//         console.log("❎ Disconnected:", socket.id);
//       });
//     });
//   } else {
//     console.log("⚠️ Socket.IO already running.");
//   }

//   res.end();
// }
// pages/api/socket.ts
import { Server as IOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import type { NextApiRequest } from "next";
import type { NextApiResponseWithSocket } from "@/types/index";
import { createMessage } from "@/app/neo4j.action";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket?.server.io) {
    console.log("🔌 Initializing Socket.IO server...");

    const io = new IOServer(res.socket.server as HTTPServer, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("✅ Connected:", socket.id);

      socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`📥 Joined room: ${room}`);
      });

      socket.on("send_message", async (msg) => {
        console.log(`💬 ${msg.sender} in room ${msg.room}: ${msg.text}`);
        socket.to(msg.room).emit("receive_message", msg);

        try {
          await createMessage(msg.room, msg.sender, msg.text, msg.timestamp);
        } catch (error) {
          console.error("❌ DB error:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("❎ Disconnected:", socket.id);
      });
    });
  } else {
    console.log("⚠️ Socket.IO already running.");
  }

  res.end();
}
