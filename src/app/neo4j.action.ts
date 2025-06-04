'use server';

import {driver} from "@/db/index";
import { Neo4jUser } from "@/types";



// // Get user by ID
// export const getUserById = async (id: string): Promise<Neo4jUser | null> => {
//     const session = driver.session();
//     try {
//         const result = await session.run(
//         `MATCH (u:User {applicationId: $id}) RETURN u`,
//         { id }
//         );
//         if (result.records.length === 0) return null;
//         return result.records[0].get("u").properties as Neo4jUser;
//     } finally {
//         await session.close();
//     }
// };

// // Create a new user
// export const createUser = async (user: Neo4jUser) => {
//     const session = driver.session();
//     try {
//         await session.run(
//         `CREATE (u:User {
//             applicationId: $applicationId,
//             firstname: $firstname,
//             lastname: $lastname,
//             email: $email
//         })`,
//         user
//         );
//     } finally {
//         await session.close();
//     }
// };

// // Record a swipe (LIKE or DISLIKE)
// export const recordSwipe = async (
//     swiperId: string,
//     swipeType: "LIKE" | "DISLIKE",
//     swipedId: string
//     ): Promise<boolean> => {
//     const session = driver.session();
//     try {
//         // Create swipe relationship
//         await session.run(
//         `
//         MATCH (swiper:User {applicationId: $swiperId})
//         MATCH (swiped:User {applicationId: $swipedId})
//         MERGE (swiper)-[r:${swipeType}]->(swiped)
//         `,
//         { swiperId, swipedId }
//     );

//     // If LIKE, check if mutual match exists
//     if (swipeType === "LIKE") {
//         const matchCheck = await session.run(
//         `
//         MATCH (swiper:User {applicationId: $swiperId})
//         MATCH (swiped:User {applicationId: $swipedId})
//         MATCH (swiped)-[:LIKE]->(swiper)
//         RETURN swiper, swiped
//         `,
//         { swiperId, swipedId }
//         );

//         return matchCheck.records.length > 0;
//         }
//         return false;
//     } finally {
//         await session.close();
//     }
// };

// // Create or fetch chat room between two matched users
// export const getOrCreateRoom = async (
//     userId1: string,
//     userId2: string
//     ): Promise<string> => {
//     const session = driver.session();
//     const roomId = [userId1, userId2].sort().join("_");

//     try {
//         await session.run(
//         `
//         MERGE (r:Room {id: $roomId})
//         WITH r
//         MATCH (u1:User {applicationId: $userId1}), (u2:User {applicationId: $userId2})
//         MERGE (u1)-[:MEMBER_OF]->(r)
//         MERGE (u2)-[:MEMBER_OF]->(r)
//         RETURN r.id AS roomId
//         `,
//         { roomId, userId1, userId2 }
//         );
//         return roomId;
//     } finally {
//         await session.close();
//     }
// };

// // Save a chat message
// export const createMessage = async (
//   roomId: string,
//   sender: string,
//   text: string,
//   timestamp: number
// ) => {
//   const session = driver.session();
//   try {
//     const result = await session.run(
//       `
//       MERGE (r:Room {id: $roomId})
//       CREATE (m:Message {
//         text: $text,
//         sender: $sender,
//         timestamp: $timestamp
//       })
//       MERGE (r)-[:HAS_MESSAGE]->(m)
//       RETURN m
//       `,
//       { roomId, text, sender, timestamp }
//     );
//     return result.records[0].get("m").properties;
//   } finally {
//     await session.close();
//   }
// };

// // Get messages from a room ordered by timestamp
// export const getMessages = async (roomId: string) => {
//   const session = driver.session();
//   try {
//     const result = await session.run(
//       `
//       MATCH (r:Room {id: $roomId})-[:HAS_MESSAGE]->(m:Message)
//       RETURN m ORDER BY m.timestamp ASC
//       `,
//       { roomId }
//     );
//     return result.records.map((record) => record.get("m").properties);
//   } finally {
//     await session.close();
//   }
// };



export const getUserId=async (id:string) =>{
    const result=await driver.executeQuery(`MATCH (u:User{ applicationId: $applicationId }) RETURN u`,
        {applicationId:id}
    );

    const user=result.records.map((record)=> record.get("u").properties);

    if(user.length===0) return null;
    return user[0] as Neo4jUser;

}

export const createUser=async(user:Neo4jUser)=>{
    const {applicationId,email,firstname,lastname}=user;

    await driver.executeQuery(`CREATE (u: User {applicationId: $applicationId,email: $email,firstname: $firstname, lastname: $lastname})`,
        {applicationId,email,firstname,lastname}
    )
}

export const getUserWithNoConnection=async(id:string)=>{
    const result=await driver.executeQuery(
        `MATCH (cu: User {applicationId: $applicationId}) MATCH (ou: User) WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou RETURN ou`,
        {applicationId:id}
    );
    const user=result.records.map((record)=>record.get("ou").properties)
    return user as Neo4jUser[];
}

export const neo4jSwipe=async(
    id:string,
    swipe:string,
    userId:string
)=>{
    const type=swipe === "left" ? "DISLIKE" : "LIKE";
    await driver.executeQuery(
        `MATCH (cu: User {applicationId: $id}), (ou: User {applicationId: $userId}) CREATE (cu)-[:${type}]->(ou)`,
        {
            id,
            userId
        }
        
    )
    if(type==="LIKE"){
        const result=await driver.executeQuery(
        `MATCH (cu: User {applicationId: $id}), (ou: User {applicationId: $userId}) WHERE (ou)-[:LIKE]->(cu) RETURN ou as match`,
        {
            id,
            userId
        })
        const matches=result.records.map(
            (record)=>record.get("match").properties
        )
        return Boolean(matches.length>0)
    }
    
}

export const getMatches=async (currentUserId: string) => {
    const result=await driver.executeQuery(
        `MATCH (cu: User {applicationId: $id})-[:LIKE]-(ou: User)-[:LIKE]->(cu) RETURN ou as match`,
        {id:currentUserId}
    )
    const matches=result.records.map((record)=>record.get("match").properties)
    return matches as Neo4jUser[]
}

export const createMessage = async (
    roomId: string,
    sender: string,
    text: string,
    timestamp: number
    ) => {
    const session = driver.session();
    try {
    const result = await session.run(
        `
        MERGE (r:Room {id: $roomId})
        CREATE (m:Message {
            text: $text,
            sender: $sender,
            timestamp: $timestamp
        })
        MERGE (r)-[:HAS_MESSAGE]->(m)
        RETURN m
        `,
        { roomId, text, sender, timestamp }
    );

    return result.records[0].get("m");
    } catch (error) {
        console.error("❌ Error creating message:", error);
        throw error;
    } finally {
        await session.close();
    }
};



// export async function createMessage(room: string, sender: string, text: string, timestamp: number) {
//   const session = driver.session();
//   try {
//     const result = await session.run(
//       `
//       MERGE (r:Room {name: $room})
//       CREATE (m:Message {text: $text, sender: $sender, timestamp: $timestamp})
//       MERGE (r)-[:HAS_MESSAGE]->(m)
//       RETURN m
//       `,
//       { room, text, sender, timestamp }
//     );

//     if (result.records.length === 0) return null;
//     return result.records[0].get("m");
//   } finally {
//     await session.close();
//   }
// }

// export const getMessages = async (roomName: string) => {
//   const result = await driver.executeQuery(
//     `
//     MATCH (r:Room {name: $roomName})-[:HAS_MESSAGE]->(m:Message)
//     RETURN m ORDER BY m.timestamp ASC
//     `,
//     { roomName }
//   );

//   const messages = result.records.map((record) => {
//     const m = record.get("m").properties;
//     return {
//       text: m.text,
//       sender: m.sender,
//       timestamp: m.timestamp.toNumber ? m.timestamp.toNumber() : m.timestamp,
//     };
//   });

//   return messages;
// };