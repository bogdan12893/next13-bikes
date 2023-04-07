import { getServerSession } from "next-auth";
import Categories from "../components/categories-page/Catagories";
import { redirect } from "next/navigation";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  {
    session?.user.role !== "ADMIN" && redirect("/");
  }
  return <Categories />;
}
