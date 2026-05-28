import { NotFoundError } from "@/lib/errors/app-errors";
import prisma from "@/prisma-client";
import type { Lecturer } from "@oop/types/lecturer.types";

export class LecturerRepository {
  async getAll(): Promise<Lecturer[]> {
    const lecturers: Lecturer[] = await prisma.lecturer.findMany();

    // lecturers table nie powinno być puste
    if (lecturers.length < 0) throw new NotFoundError("Lecturers repository is empty");

    return lecturers;
  }
}
