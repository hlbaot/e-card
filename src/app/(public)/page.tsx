import { HomeView } from "@/views/HomeView";
import { cachedPublicCards } from "@/server/cards/cache";

// Tối ưu ISR: Cache dữ liệu trang chủ 60 giây để chuyển trang tức thì (< 30ms).
export const revalidate = 60;

export default async function Page() {
  return <HomeView employees={await cachedPublicCards.list()} />;
}
