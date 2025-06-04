"use client";
import { Neo4jUser } from "@/types";
import React from "react";
import TinderCard from "react-tinder-card"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import { neo4jSwipe } from "../neo4j.action";

interface HomepageClientComponentProps {
    currentUser: Neo4jUser;
    user: Neo4jUser[];
}

const HomepageClientComponent: React.FC<HomepageClientComponentProps> = ({
    currentUser,
    user,
}) => {

    const handleSwipe=async (direction:string,userId:string)=>{
        const isMatch=await neo4jSwipe(currentUser.applicationId,direction,userId)

        if(isMatch){
            alert( `Congrats !! Its a match`)
        }
    }
    return(
        <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
            <div className="relative w-80 h-[500px]">
                <div className="mb-4 text-center">
                <h1 className="text-3xl font-semibold text-white">
                    Hello {currentUser.firstname} {currentUser.lastname}
                </h1>
                </div>

                {user.map((users) => (
                <TinderCard
                    key={users.applicationId}
                    onSwipe={(dir) => handleSwipe(dir, users.applicationId)}
                    className="absolute w-full h-full"
                    preventSwipe={["up", "down"]}
                >
                    <Card className="w-full h-full flex flex-col justify-between shadow-xl rounded-2xl bg-white border p-4">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                            {users.firstname} {users.lastname}
                            </CardTitle>
                            <CardDescription className="text-sm text-gray-500">
                                {users.email}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 flex items-center justify-center">
                            <p className="text-gray-600">Card Content</p>
                        </CardContent>

                        <CardFooter className="text-center">
                            <p className="text-gray-500 text-sm">Swipe left or right</p>
                        </CardFooter>
                    </Card>
                </TinderCard>
                ))}
            </div>
            </div>

    )
};

export default HomepageClientComponent;
