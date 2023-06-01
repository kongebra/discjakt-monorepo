import clsx from "clsx";
import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?:
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "ghost"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "error";
  outline?: boolean;
  size?: "xs" | "sm" | "lg" | "xl";
  shape?: "square" | "circle";
  block?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      type = "button",
      color,
      outline,
      size,
      shape,
      block,
      loading,
      loadingText,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          "btn",
          color && `btn-${color}`,
          size && `btn-${size}`,
          shape && `btn-${shape}`,
          outline && {
            "btn-outline": outline,
            "btn-disabled": disabled,
            "btn-block": block,
          },
          className
        )}
        disabled={disabled}
        {...rest}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner" />
            {loadingText !== undefined ? loadingText : null}
          </>
        ) : (
          <>{children}</>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
