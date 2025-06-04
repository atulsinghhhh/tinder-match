import React from "react";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "../components/ui/navigation-menu"; 

function Navbar() {
    return (
    <nav className="w-full bg-gradient-to-r from-pink-500 to-red-500 shadow-md p-4 flex flex-col justify-center items-center">
        <NavigationMenu>
            <NavigationMenuList className="flex space-x-6 text-lg text-white font-semibold">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/">Home</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/match">Match</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/logout">Logout</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    </nav>
    );
}

export default Navbar;
