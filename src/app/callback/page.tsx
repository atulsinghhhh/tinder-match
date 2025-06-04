
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { createUser, getUserId } from "../neo4j.action";


export default async function CallbackPage(){

    const { isAuthenticated, getUser } = getKindeServerSession();

    const authenticated = await isAuthenticated();
    if (!authenticated) {
        redirect("/api/auth/login?post_login_redirect_url=/callback");
    }
    const user = await getUser();
    if (!user) {
        redirect("/api/auth/login?post_login_redirect_url=/callback");
    }

    // check if user is already there in neo4j
    // if not create a user

    const dbUser=await getUserId(user.id)

    if(!dbUser){
        // create user in neo4j
        await createUser({
            applicationId:user.id,
            email:user.email!,
            firstname:user.given_name!,
            lastname:user.family_name ?? undefined
        })
    }

    redirect('/')


}