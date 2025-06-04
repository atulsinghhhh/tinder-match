'use client';
import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../components/ui/card";

import Link from "next/link"; 

export default function ClientMatchPage({ matches }: { matches: any[] }) {

    return (
        <main>
            {matches.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">No matches found. Start swiping!</p>
            ) : (
                matches.map((users) => (
                    // Wrap Card inside Link here:
                    <Link href={`/chat/${users.applicationId}`} key={users.applicationId}>
                        <Card className="cursor-pointer hover:shadow-lg transition my-4 bg-gray-800">
                            <CardHeader>
                            <CardTitle className=' flex flex-col text-white text-center text-2xl'>{users.firstname} {users.lastname}</CardTitle>
                            <CardDescription className='flex flex-col text-white text-center text-1xl'>{users.email}</CardDescription>
                            </CardHeader>
                        </Card>
                        </Link>

                ))
            )}
        </main>
    );
}
