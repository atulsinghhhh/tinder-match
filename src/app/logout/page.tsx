import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Logoutpage() {
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-red-400 to-red-600">
        <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Ready to Logout?</h1>
        <LogoutLink
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow-md transition duration-300"
        >
            Logout
        </LogoutLink>
        </div>
    </div>
    );
}
