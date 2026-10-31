import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HomeView } from "@/views/HomeView";
import { cachedPublicCards } from "@/server/cards/cache";
import { ACCESS_COOKIE, SESSION_COOKIE } from "@/server/auth/http";
import { serverAuth } from "@/server/auth/runtime";

export default async function Page() {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  let authenticated = false;
  if (access) {
    try {
      await serverAuth.currentUser(access);
      authenticated = true;
    } catch {
      authenticated = await serverAuth.hasActiveRefreshSession(access);
    }
  }
  if (!authenticated && session) {
    authenticated = await serverAuth.hasActiveRefreshSession(session);
  }

  if (authenticated) {
    redirect("/admin");
  }

  return <HomeView employees={await cachedPublicCards.list()} />;
}
