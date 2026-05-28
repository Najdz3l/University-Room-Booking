import prisma from "@/prisma-client";
import { lecturersData, roomsData, classesData, sessionsData } from "./seed-data.js";
import { ENV } from "@lib/constants/env.js";

const PRISMA_LOG_SEEDING: boolean = ENV.PRISMA_LOG_SEEDING;

const seedLecturers = async (): Promise<void> => {
  await prisma.lecturer.deleteMany();
  await prisma.lecturer.createMany({
    data: lecturersData,
    skipDuplicates: true,
  });

  if (PRISMA_LOG_SEEDING) {
    const lecturers = await prisma.lecturer.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
    console.table(lecturers);
  }
};

const seedRooms = async (): Promise<void> => {
  await prisma.room.deleteMany();
  await prisma.room.createMany({
    data: roomsData,
    skipDuplicates: true,
  });

  if (PRISMA_LOG_SEEDING) {
    const rooms = await prisma.room.findMany({
      select: {
        id: true,
        name: true,
        floor: true,
        building: true,
      },
    });
    console.table(rooms);
  }
};

const seedClasses = async (): Promise<void> => {
  await prisma.class.deleteMany();
  await prisma.class.createMany({
    data: classesData,
    skipDuplicates: true,
  });

  if (PRISMA_LOG_SEEDING) {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    console.table(classes);
  }
};

const seedSessions = async (): Promise<void> => {
  await prisma.session.deleteMany();
  await prisma.session.createMany({
    data: sessionsData,
    skipDuplicates: true,
  });

  if (PRISMA_LOG_SEEDING) {
    const sessions = await prisma.session.findMany({
      select: {
        id: true,
        class: {
          select: {
            name: true,
          },
        },
        room: {
          select: {
            name: true,
          },
        },
      },
    });

    console.table(sessions);
  }
};

const main = async () => {
  console.log("Seeding database...");
  await seedLecturers();
  await seedRooms();
  await seedClasses();
  await seedSessions();
};

main()
  .then(() => {
    console.log("Database seeded successfully.");
    process.exit(0); // Zakończ proces po zakończeniu seedingowania
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
