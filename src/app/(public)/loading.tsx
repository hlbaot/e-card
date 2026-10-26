import { PublicHeader } from "@/client/components/layout/PublicHeader";
import { Skeleton } from "@/client/components/ui/Skeleton";

export default function Loading() {
  return (
    <>
      <PublicHeader />
      <main className="container py-12">
        <Skeleton />
      </main>
    </>
  );
}
