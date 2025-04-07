import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {},
  callbacks: {
    async session({ session, token }) {
      // Usamos el username del token para buscar el user en la base de datos
      if (token?.username) {
        const userFound = await prisma.user.findUnique({
          where: { username: token.username },
        });

        if (userFound) {
          session.user.id = userFound.id; // Añade el id del usuario a la sesión
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Guardamos el username en el token cuando el usuario inicia sesión
      if (user) {
        token.username = user.username;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@domain.com" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        // Buscar usuario en la base de datos
        const userFound = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!userFound) throw new Error("No user found");

        // Comparar contraseñas
        const matchPassword = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!matchPassword) throw new Error("Wrong password");

        return {
          id: userFound.id,
          username: userFound.username,
          email: userFound.email,
          isAdmin: userFound.isAdmin,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
