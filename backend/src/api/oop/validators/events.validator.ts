import { z } from "zod";

// Główny walidator do błędów walidacji dla endpointów związanych z wydarzeniami
export const formatValidationError = (error: z.ZodError) => z.treeifyError(error);

// Walidator do pobierania wydarzeń z podanego zakresu dat i formatu
export const EventDateRangeValidator = z
  .object({
    start: z.iso.datetime({ offset: true }),
    end: z.iso.datetime({ offset: true }),
    format: z.enum(["MONTH", "DAY"]),
  })
  .refine((data) => new Date(data.start) < new Date(data.end), {
    message: "Data 'start' musi być wcześniejsza niż data 'end'",
    path: ["start"],
  });
export type EventDateRangeQuery = z.infer<typeof EventDateRangeValidator>;

// Walidator do tworzenia nowego wydarzenia (zajęcia)
export const CreateEventValidator = z
  .object({
    classId: z.uuid(),
    lecturerId: z.uuid(),
    roomId: z.uuid(),
    startTime: z.iso.datetime({ offset: true }),
    endTime: z.iso.datetime({ offset: true }),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "Data 'startTime' musi być wcześniejsza niż data 'endTime'",
    path: ["startTime"],
  });
export type CreateEventDto = z.infer<typeof CreateEventValidator>;

// Walidator do usuwania zajęć
export const DeleteEventValidator = z.object({
  id: z.uuid(),
});
export type DeleteEventDto = z.infer<typeof DeleteEventValidator>;
