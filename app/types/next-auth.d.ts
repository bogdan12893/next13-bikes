import type { User } from "@prisma/client";
import { Role } from "@prisma/client";
import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    stripeId: string;
    role: Role;
    email: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
