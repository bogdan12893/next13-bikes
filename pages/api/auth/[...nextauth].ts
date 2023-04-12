import prisma from "@/prisma";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) return null;

        if (!user.confirmed) {
          throw new Error(
            "Please check your email to verify your email address"
          );
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          stripeId: user.stripeId,
          riderType: user.riderType,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          stripeId: token.stripeId,
          role: token.role,
          riderType: token.riderType,
        },
      };
    },
    jwt: async ({ token, user }) => {
      const dbUser = await prisma.user.findUnique({
        where: { email: token.email },
      });

      if (!dbUser) {
        if (user) {
          const u = user as User;
          return {
            ...token,
            role: u.role,
            id: u.id,
            stripeId: u.stripeId,
            riderType: u.riderType,
          };
        }
        return token;
      }

      return {
        ...token,
        role: dbUser.role,
        id: dbUser.id,
        stripeId: dbUser.stripeId,
        riderType: dbUser.riderType,
      };
    },
  },
};

export default NextAuth(authOptions);
