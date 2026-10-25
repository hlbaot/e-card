import { HomeView } from "@/views/HomeView";
import { getActiveEmployees } from "@/server/employees";

export const dynamic = "force-dynamic";

export default async function Page() {
  return <HomeView employees={await getActiveEmployees()} />;
}
