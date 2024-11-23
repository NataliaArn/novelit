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
          return user; // Retorna el usuario si las credenciales son válidas
        }

        return null; // Retorna null si las credenciales son inválidas
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/login", // Página personalizada para el inicio de sesión
  },

  callbacks: {
    async session({ session, user }) {
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
        // Crea un nuevo usuario en la base de datos
        async createUser(profile) {
          return prisma.user.create({
            data: {
              username: profile.username,
              email: profile.email,
              password: profile.password,
            },
          });
        },

        // Recupera una sesión y el usuario asociado
        async getSessionAndUser(sessionToken) {
          const session = await prisma.session.findUnique({
            where: { sessionToken },
            include: { user: true },
          });
          return session ? { session, user: session.user } : null;
        },

        // Crea una nueva sesión en la base de datos
        async createSession(session) {
          return prisma.session.create({
            data: session,
          });
        },

        // Actualiza una sesión existente
        async updateSession(session) {
          return prisma.session.update({
            where: { sessionToken: session.sessionToken },
            data: session,
          });
        },

        // Elimina una sesión por su token
        async deleteSession(sessionToken) {
          return prisma.session.delete({
            where: { sessionToken },
          });
        },

        // Obtiene un usuario por ID
        async getUser(id) {
          return prisma.user.findUnique({
            where: { id },
          });
        },

        // Obtiene un usuario por email
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
