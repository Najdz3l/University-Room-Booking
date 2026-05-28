import { getAllLecturers } from "@fp/repositories/lecturer.repository";
import { getAllRooms } from "@fp/repositories/room.repository";
import { getAllClasses } from "@fp/repositories/class.repository";
import type { FormattedFormData, RawFormData, RawFormDataTuple } from "@fp/types/form-data.types";
import { formatFormData as helperFormatFormData } from "@/lib/helpers/format-form-data";

export const getFormData = async (): Promise<FormattedFormData> => {
  const [lecturers, rooms, classes]: RawFormDataTuple = await Promise.all([
    getAllLecturers(),
    getAllRooms(),
    getAllClasses(),
  ]);

  const rawFormData: RawFormData = { lecturers, rooms, classes };
  const formattedFormData: FormattedFormData = helperFormatFormData(rawFormData);

  return formattedFormData;
};
