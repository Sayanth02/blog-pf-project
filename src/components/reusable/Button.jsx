import React from "react";

const Button = ({ label, className = "", variant = "default", ...props }) => {
  const base =
    "px-4 py-2 rounded-md border text-base transition-colors transition-transform duration-200 hover:scale-105";
  const styles =
    variant === "outlined"
      ? "bg-transparent border-neutral-dark text-neutral-darker"
      : "bg-dodger-blue border-neutral-dark text-white";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {label}
    </button>
  );
};

export default Button;
