import { LecturerRepository } from "@oop/repositories/lecturer.repository";
import { RoomRepository } from "@oop/repositories/room.repository";
import { ClassRepository } from "@oop/repositories/class.repository";
import type { FormattedFormData, RawFormData, RawFormDataTuple } from "@oop/types/form-data.types";
import { formatFormData } from "@/lib/helpers/format-form-data";

export class FormDataService {
  constructor(
    private readonly lecturerRepo: LecturerRepository = new LecturerRepository(),
    private readonly roomRepo: RoomRepository = new RoomRepository(),
    private readonly classRepo: ClassRepository = new ClassRepository(),
  ) {}

  async getFormData() {
    const [lecturers, rooms, classes]: RawFormDataTuple = await Promise.all([
      this.lecturerRepo.getAll(),
      this.roomRepo.getAll(),
      this.classRepo.getAll(),
    ]);

    const rawFormData: RawFormData = { lecturers, rooms, classes };
    const formattedFormData: FormattedFormData = formatFormData(rawFormData);

    return formattedFormData;
  }
}
