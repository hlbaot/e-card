import { QueryClient } from "@tanstack/react-query";
import { useEmployeeStore } from "@/client/store/employee.store";
import { useAuthStore } from "@/client/store/auth.store";

export function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: {
    staleTime: 60_000, gcTime: 10 * 60_000, refetchOnWindowFocus: false, retry: 1,
  } } });
}
/** Synchronous subscription clears pending queries and mutations on identity change. */
export function bindQuerySession(client: QueryClient) {
  return useAuthStore.subscribe((state, previous) => {
    if (state.user?.id !== previous.user?.id || state.authenticated !== previous.authenticated) {
      client.clear();
      useEmployeeStore.setState({ employeeSearch: "", cardSearch: "" });
    }
  });
}
