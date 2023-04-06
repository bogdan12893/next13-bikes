import { getServerSession } from "next-auth";
import Categories from "../components/categories-page/Catagories";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  {
    session?.user.role !== "ADMIN" && redirect("/");
  }
  return <Categories />;
}
