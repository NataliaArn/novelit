import NextAuth from "next-auth";
import PostgresAdapter from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PostgresAdapter(prisma),

  // Proveedores de autenticación
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verifica que se hayan proporcionado email y contraseña
        if (!credentials?.email || !credentials?.password) return null;

        // Busca al usuario en la base de datos por su email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // Compara la contraseña ingresada con la contraseña en la base de datos
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        // Retorna un objeto de usuario válido
        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],

  callbacks: {
    // Modifica el token JWT para incluir información adicional
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Agrega el ID del usuario al token
        token.username = user.username; // Agrega el username al token
      }
      return token;
    },

    // Incluye datos adicionales del usuario
    async session({ session, token }) {
      session.user.id = token.id; // Agrega el ID del usuario a la sesión
      session.user.username = token.username; // Agrega el username a la sesión
      return session;
    },
  },

  session: {
    strategy: "jwt", // Usa JWT para manejar las sesiones
  },
};

// Exporta los controladores de NextAuth
export const {
  handlers: { GET, POST }, // Rutas de la API para manejar autenticación
  auth, // Middleware para proteger rutas
  signIn, // Método para iniciar sesión
  signOut, // Método para cerrar sesión
} = NextAuth(authOptions);
