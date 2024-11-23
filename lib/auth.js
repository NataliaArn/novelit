import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const getSessionAuth = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("No hay sesión activa");
  }
  return session;
};

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  // Proveedores de autenticación
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
};

// Exportar el resto de las funciones
export const {
  handlers: { GET, POST },
  auth: nextAuthAuth,
  signIn,
  signOut,
} = NextAuth(authOptions);
