
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { redirect } from "next/navigation";
require('dotenv').config();

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session?.user);
  if(session?.user){
    redirect('/explore');
  }else{
    redirect('/api/auth/signin');
  }
}
