import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ProfileInfo from "../components/profile/ProfileInfo";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <ProfileInfo session={session} />
    </div>
  );
}
