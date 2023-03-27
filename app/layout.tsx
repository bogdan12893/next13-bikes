import { getServerSession } from "next-auth";
import Navbar from "./components/layout/Navbar";
import "./globals.css";
import QueryWrapper from "./QueryWrapper";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "@prisma/client";

export const metadata = {
  title: "Bikes App",
  description: "Bikes bikes bikes",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <Navbar session={session} />
        <QueryWrapper>{children}</QueryWrapper>
      </body>
    </html>
  );
}
