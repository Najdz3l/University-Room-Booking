import { Button } from "@components/atoms/Button/Button";
import type { WeekendToggleProps } from "./WeekendToggle.types";

export const WeekendToggle = ({ checked, onChange }: WeekendToggleProps) => {
  return (
    <Button type="button" variant="secondary" fullWidth onClick={onChange}>
      {checked ? "Ukryj weekendy" : "Pokaż weekendy"}
    </Button>
  );
};
