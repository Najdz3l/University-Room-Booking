import { NotFoundError } from "@/lib/errors/app-errors";
import prisma from "@/prisma-client";
import type { Class } from "@declarative/types/class.types";

export const getAllClasses = (): Promise<Class[]> =>
  prisma.class.findMany().then((classes: Class[]) => {
    // classes table nie powinno być puste
    if (classes.length < 0) throw new NotFoundError("Classes repository is empty");
    return classes;
  });
