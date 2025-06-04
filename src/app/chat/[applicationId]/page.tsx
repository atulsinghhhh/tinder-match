// app/chat/[applicationId]/page.tsx (App Router example)

import ChatPage from "../../components/Chatpage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function ChatRoomPage({ params }: { params: { applicationId: string } }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !params.applicationId) return <div>Access denied</div>;

  return (
    <ChatPage
      currentUser={{
        id: user.id,
        firstname: user.given_name ?? "User", // 👈 fallback here
      }}
      applicationId={params.applicationId}
    />
  );
}
