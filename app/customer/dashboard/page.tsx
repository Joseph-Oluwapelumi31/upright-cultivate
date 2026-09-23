import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth/logout";



export default async function CustomerDashboardPage() {
  const session = await auth();
  console.log("DASHBOARD SESSION:", session);
  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <main>
      <h1>Customer Dashboard</h1>

      <p>Name: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      <p>User ID: {session.user.id}</p>

      <form action={logoutAction}>
        <button type="submit">
            Sign out
          </button>
    </form>
    </main>
  );
}