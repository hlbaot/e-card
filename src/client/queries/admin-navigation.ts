import type { QueryClient } from "@tanstack/react-query";
import type { useRouter } from "next/navigation";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";
import { useAuthStore } from "@/client/store/auth.store";
import { routes } from "@/shared/constants/routes";
import { employeesOptions } from "./employees";

const employeePages = new Set([routes.admin, routes.employees, routes.cards]);
const adminPages = new Set([...employeePages, routes.profile]);

/** These four pages share the existing admin-session authorization policy. */
export function createAdminNavigationPrefetcher(
  client: QueryClient,
  router: Pick<ReturnType<typeof useRouter>, "prefetch">,
) {
  const prefetchedRoutes = new Map<string, symbol>();

  return async (href: string): Promise<void> => {
    // Read the live session on each interaction, including after logout/expiry.
    const { ready, authenticated, user } = useAuthStore.getState();
    if (!ready || !authenticated || !user?.id || !adminPages.has(href)) return;

    const routeKey = `${user.id}:${href}`;
    if (!prefetchedRoutes.has(routeKey)) {
      const request = Symbol();
      prefetchedRoutes.set(routeKey, request);
      const invalidate = () => {
        if (prefetchedRoutes.get(routeKey) === request) prefetchedRoutes.delete(routeKey);
      };
      try {
        // Only a later hover/focus retries an expired or failed route prefetch.
        void Promise.resolve(router.prefetch(href, {
          kind: PrefetchKind.FULL,
          onInvalidate: invalidate,
        })).catch(invalidate);
      } catch {
        invalidate();
      }
    }

    if (employeePages.has(href)) {
      // Same key, function and freshness as useEmployees. TanStack deduplicates
      // both fresh results and in-flight requests shared by these three pages.
      await client.prefetchQuery({ ...employeesOptions(user.id), retry: false }).catch(() => {});
    }
    // Profile uses the authenticated user already in the store, not an API query.
  };
}
