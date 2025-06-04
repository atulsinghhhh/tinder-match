import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { getMatches} from "../neo4j.action"; 
import ClientMatchPage from "./clientMatchPage"; 


export default async function MatchPage(){
        const { isAuthenticated, getUser } = getKindeServerSession();

        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return redirect("/api/auth/login?post_login_redirect_url=/callback");
        }

        const user = await getUser();
        if (!user) {
            return redirect("/api/auth/login?post_login_redirect_url=/callback");
        }

        const matches=await getMatches(user.id)

        return(
            <ClientMatchPage matches={matches} />
        )
}
