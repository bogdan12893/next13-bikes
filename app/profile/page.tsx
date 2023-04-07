import { getServerSession } from "next-auth";
import ProfileInfo from "../components/profile/ProfileInfo";
// import { authOptions } from "../api/auth/[...nextauth]/route";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <ProfileInfo session={session} />
    </div>
  );
}
