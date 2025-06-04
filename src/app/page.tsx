import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getUserId, getUserWithNoConnection } from "./neo4j.action"; 
import HomepageClientComponent from "@/app/components/Home"


export default async function Home() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/api/auth/login?post_login_redirect_url=/callback");
  }

  const user = await getUser();
  if (!user) {
    redirect("/api/auth/login?post_login_redirect_url=/callback");
  }

  const userWithNoConnection=await getUserWithNoConnection(user.id);
  const currentUser=await getUserId(user.id);

  return( 
    <main>
      {currentUser && <HomepageClientComponent currentUser={currentUser} user={userWithNoConnection}/>}
    </main>
  );
}
