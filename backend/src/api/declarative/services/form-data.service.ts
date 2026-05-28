import { getAllLecturers } from "@declarative/repositories/lecturer.repository";
import { getAllRooms } from "@declarative/repositories/room.repository";
import { getAllClasses } from "@declarative/repositories/class.repository";
import type { FormattedFormData, RawFormData, RawFormDataTuple } from "@declarative/types/form-data.types";
import { formatFormData as helperFormatFormData } from "@/lib/helpers/format-form-data";

export const getFormData = async (): Promise<FormattedFormData> => {
  const [lecturers, rooms, classes]: RawFormDataTuple = await Promise.all([
    getAllLecturers(),
    getAllRooms(),
    getAllClasses(),
  ]);

  const rawFormData: RawFormData = { lecturers, rooms, classes };

  return helperFormatFormData(rawFormData);
};
