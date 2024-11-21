import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      // Guarda los datos del usuario en el JWT
      session.user.id = user.id;
      session.user.username = user.username;
      session.user.email = user.email;
      session.user.isAdmin = user.isAdmin;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
  },
  adapter: {
    async getAdapter() {
      return {
        async createUser(profile) {
          return prisma.user.create({
            data: {
              username: profile.username,
              email: profile.email,
              password: profile.password,
            },
          });
        },
        async getSessionAndUser(sessionToken) {
          const session = await prisma.session.findUnique({
            where: { sessionToken },
            include: { user: true },
          });
          return session ? { session, user: session.user } : null;
        },
        async createSession(session) {
          return prisma.session.create({
            data: session,
          });
        },
        async updateSession(session) {
          return prisma.session.update({
            where: { sessionToken: session.sessionToken },
            data: session,
          });
        },
        async deleteSession(sessionToken) {
          return prisma.session.delete({
            where: { sessionToken },
          });
        },
        async getUser(id) {
          return prisma.user.findUnique({
            where: { id },
          });
        },
        async getUserByEmail(email) {
          return prisma.user.findUnique({
            where: { email },
          });
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
