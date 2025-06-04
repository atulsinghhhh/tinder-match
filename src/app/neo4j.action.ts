'use server';

import {driver} from "@/db/index";
import { Neo4jUser } from "@/types";


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

export async function createMessage(room: string, sender: string, text: string, timestamp: number) {
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MERGE (r:Room {name: $room})
      CREATE (m:Message {text: $text, sender: $sender, timestamp: $timestamp})
      MERGE (r)-[:HAS_MESSAGE]->(m)
      RETURN m
      `,
      { room, text, sender, timestamp }
    );

    if (result.records.length === 0) return null;
    return result.records[0].get("m");
  } finally {
    await session.close();
  }
}

export const getMessages = async (roomName: string) => {
  const result = await driver.executeQuery(
    `
    MATCH (r:Room {name: $roomName})-[:HAS_MESSAGE]->(m:Message)
    RETURN m ORDER BY m.timestamp ASC
    `,
    { roomName }
  );

  const messages = result.records.map((record) => {
    const m = record.get("m").properties;
    return {
      text: m.text,
      sender: m.sender,
      timestamp: m.timestamp.toNumber ? m.timestamp.toNumber() : m.timestamp,
    };
  });

  return messages;
};