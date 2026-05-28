import type { ButtonProps } from "./Button.types";
import "./Button.css";

export const Button = ({ children, variant = "primary", fullWidth = false, className = "", ...props }: ButtonProps) => {
  const baseClass = "atom-button";
  const variantClass = `${baseClass}--${variant}`;
  const widthClass = fullWidth ? `${baseClass}--full-width` : "";
  const combinedClasses = [baseClass, variantClass, widthClass, className].filter(Boolean).join(" ");

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
