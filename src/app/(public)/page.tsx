import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HomeView } from "@/views/HomeView";
import { cachedPublicCards } from "@/server/cards/cache";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/server/auth/http";
import { serverAuth } from "@/server/auth/runtime";

export default async function Page() {
  const cookieStore = await cookies();
  const access = cookieStore.get(ACCESS_COOKIE)?.value;
  const refresh = cookieStore.get(REFRESH_COOKIE)?.value;

  let authenticated = false;
  if (access) {
    try {
      await serverAuth.currentUser(access);
      authenticated = true;
    } catch {
      // access expired, check refresh below
    }
  }

  if (!authenticated && refresh) {
    try {
      const hasActive = await serverAuth.hasActiveRefreshSession(refresh);
      if (hasActive) authenticated = true;
    } catch {
      // session revoked or invalid
    }
  }

  if (authenticated) {
    redirect("/admin");
  }

  return <HomeView employees={await cachedPublicCards.list()} />;
}
