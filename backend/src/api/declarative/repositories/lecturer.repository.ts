import { NotFoundError } from "@/lib/errors/app-errors";
import prisma from "@/prisma-client";
import type { Lecturer } from "@declarative/types/lecturer.types";

export const getAllLecturers = (): Promise<Lecturer[]> =>
  prisma.lecturer.findMany().then((lecturers: Lecturer[]) => {
    // lecturers table nie powinno być puste
    if (lecturers.length < 0) throw new NotFoundError("Lecturers repository is empty");
    return lecturers;
  });
