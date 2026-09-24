import { auth } from "@/auth";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

export default async function Navigation() {
  const session = await auth();
  
  return (
    <>
      <Navbar user={session?.user || null} />
      <MobileNav user={session?.user || null} />
    </>
  );
}
