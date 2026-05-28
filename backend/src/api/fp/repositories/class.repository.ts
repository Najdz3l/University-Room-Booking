import { NotFoundError } from "@/lib/errors/app-errors";
import prisma from "@/prisma-client";
import type { Class } from "@fp/types/class.types";

export const getAllClasses = async (): Promise<Class[]> => {
  const classes: Class[] = await prisma.class.findMany();

  // classes table nie powinno być puste
  if (classes.length < 0) throw new NotFoundError("Classes repository is empty");

  return classes;
};
