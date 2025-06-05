// import { NextResponse } from "next/server";
// import { createMessage } from "../../neo4j.action";
// import { pusherServer } from "@/libs/pusher"; 

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { roomId, sender, text, timestamp } = body;

//     console.log(`Received message to save and broadcast:`, body);

//     // Save to Neo4j DB
//     await createMessage(roomId, sender, text, timestamp);

//     // Broadcast message to Pusher channel
//     await pusherServer.trigger(roomId, "new-message", {
//       roomId,
//       sender,
//       text,
//       timestamp,
//     });

//     console.log("Pusher event triggered successfully");

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("❌ Error in /api/messages:", err);
//     return NextResponse.json({ error: "Message failed to send" }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import { createMessage } from '../../neo4j.action';
import { pusherServer } from '@/libs/pusher';

export async function POST(req: Request) {
  const { roomId, sender, text, timestamp } = await req.json();

  await createMessage(roomId, sender, text, timestamp);
  // await pusherServer.trigger(roomId, 'new-message', { roomId, sender, text, timestamp });
  await pusherServer.trigger(roomId, "new-message", { roomId, sender, text, timestamp });
  console.log(`🔊 Broadcasting to room: ${roomId}`);



  return NextResponse.json({ success: true });
}