import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProfileButtons from "./components/ProfileButtons";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Perfil</h1>

        <div className="mb-4">
          <p className="text-sm text-gray-700">
            {session.user.username || session.user.email || "Usuario"}
          </p>
        </div>

        <ProfileButtons />
      </div>
    </div>
  );
}
