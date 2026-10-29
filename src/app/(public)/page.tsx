import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HomeView } from "@/views/HomeView";
import { cachedPublicCards } from "@/server/cards/cache";
import { ACCESS_COOKIE } from "@/server/auth/http";
import { serverAuth } from "@/server/auth/runtime";

export default async function Page() {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;

  let authenticated = false;
  if (access) {
    try {
      await serverAuth.currentUser(access);
      authenticated = true;
    } catch {
      // The home client checks the refresh cookie through /api/auth, its scoped path.
    }
  }

  if (authenticated) {
    redirect("/admin");
  }

  return <HomeView employees={await cachedPublicCards.list()} />;
}
