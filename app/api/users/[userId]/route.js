import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  const { userId } = params;

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  const { userId } = params;

  if (!session) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
    });
  }

  const isOwner = session.user.id === parseInt(userId);
  const isAdmin = session.user.isAdmin;

  if (!isOwner && !isAdmin) {
    return new Response(JSON.stringify({ error: "No tienes permiso" }), {
      status: 403,
    });
  }

  await prisma.user.delete({
    where: { id: parseInt(userId) },
  });

  return new Response(JSON.stringify({ message: "Usuario eliminado" }), {
    status: 200,
  });
}

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  const { userId } = params;

  if (!session) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
    });
  }

  const isOwner = session.user.id === parseInt(userId);
  const isAdmin = session.user.isAdmin;

  if (!isOwner && !isAdmin) {
    return new Response(
      JSON.stringify({ error: "No tienes permiso para editar este perfil" }),
      {
        status: 403,
      }
    );
  }

  const body = await req.json();

  const { username, email } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        username,
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        isAdmin: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar usuario" }),
      {
        status: 500,
      }
    );
  }
}
