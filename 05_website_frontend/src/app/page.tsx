import { getCategories } from "@/lib/dataFetcher";
import HomeContent from "@/components/home/HomeContent";

export const metadata = {
  title: "탱글성형외과 | 오창현 대표원장 책임진료",
  description: "당신의 가치를 높이는 디테일. 15년 무사고 오창현 대표원장의 맞춤형 바디 및 안면 거상술.",
};

export default function Home() {
  // Fetch categories statically/server-side
  const categories = getCategories();

  return <HomeContent categories={categories} />;
}
