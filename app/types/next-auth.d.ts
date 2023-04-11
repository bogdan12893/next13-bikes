import type { User } from "@prisma/client";
import { Role } from "@prisma/client";
import "next-auth/jwt";

type UserId = string;
type UserStrypeId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    stripeId: UserStrypeId;
    role: Role;
  }
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
