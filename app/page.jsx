import { createClient } from "@/utils/supabase/server";
import { getProducts } from "./actions";
import DashboardClient from "@/components/DashboardClient";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const products = user ? await getProducts() : [];

  return <DashboardClient user={user} initialProducts={products} />;
}