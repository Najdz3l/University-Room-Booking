// Model - jak wyglądają dane wykładowców z bazy danych
export type Lecturer = {
  id: string;
  titles: string;
  firstName: string;
  lastName: string;
};

// Formatted - dane sformatowane dla frontend'u (imię i nazwisko z tytułami w jednym polu)
export type FormattedLecturer = {
  id: string;
  name: string;
};
