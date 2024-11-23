const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const initialGenres = [
  "Fantasy",
  "Science fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Academy life",
  "Horror",
  "Adventure",
  "Slice of life",
  "Crime",
  "Comedy",
  "Drama",
  "Dystopian",
  "Supernatural",
];

async function main() {
  console.log("Started seeding genres...");

  try {
    const genres = await Promise.all(
      initialGenres.map((name) =>
        prisma.genre.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    );

    console.log(
      "Genres seeded successfully:",
      genres.map((genre) => genre.name).join(", ")
    );
  } catch (error) {
    console.error("Error seeding genres:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
