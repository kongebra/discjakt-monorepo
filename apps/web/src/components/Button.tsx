import clsx from "clsx";
import React, { useMemo } from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?:
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "link"
    | "info"
    | "success"
    | "warning"
    | "error";
  ghost?: boolean;
  outline?: boolean;
  size?: "xs" | "sm" | "lg" | "xl";
  shape?: "square" | "circle";
  block?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
  glass?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      type = "button",
      color,
      ghost,
      outline,
      size,
      shape,
      block,
      loading,
      loadingText,
      glass,
      disabled,
      ...rest
    },
    ref
  ) => {
    const buttonColor = useMemo(() => {
      switch (color) {
        case "neutral":
          return "btn-neutral";
        case "primary":
          return "btn-primary";
        case "secondary":
          return "btn-secondary";
        case "accent":
          return "btn-accent";
        case "link":
          return "btn-link";
        case "info":
          return "btn-info";
        case "success":
          return "btn-success";
        case "warning":
          return "btn-warning";
        case "error":
          return "btn-error";
        default:
          return undefined;
      }
    }, [color]);

    const buttonSize = useMemo(() => {
      switch (size) {
        case "xs":
          return "btn-xs";
        case "sm":
          return "btn-sm";
        case "lg":
          return "btn-lg";
        case "xl":
          return "btn-xl";
        default:
          return undefined;
      }
    }, [size]);

    const loadingSize = useMemo(() => {
      switch (size) {
        case "xs":
          return "loading-xs";
        case "sm":
          return "loading-sm";
        case "lg":
          return "loading-lg";
        default:
          return undefined;
      }
    }, [size]);

    const buttonShape = useMemo(() => {
      switch (shape) {
        case "square":
          return "btn-square";
        case "circle":
          return "btn-circle";
        default:
          return undefined;
      }
    }, [shape]);

    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          "btn",
          buttonColor,
          buttonSize,
          buttonShape,
          {
            "btn-ghost": ghost,
            "btn-outline": outline,
            "btn-disabled": disabled,
            "btn-block": block,
            glass: glass,
          },
          className
        )}
        disabled={disabled}
        {...rest}
      >
        {loading ? (
          <>
            <span className={clsx("loading loading-spinner", loadingSize)} />
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
