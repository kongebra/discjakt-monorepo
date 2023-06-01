import clsx from "clsx";
import React, { useId } from "react";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  bordered?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  ghost?: boolean;
  label?: React.ReactNode;
  error?: React.ReactNode;

  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      type = "text",
      bordered = true,
      size,
      color,
      ghost,
      label,
      error,
      prefix,
      suffix,
      ...rest
    },
    ref
  ) => {
    const internalId = useId();
    const resolvedId = id ?? internalId;

    return (
      <div className={clsx("form-control", className)}>
        {label !== undefined ? (
          <label htmlFor={resolvedId} className="label">
            <span
              className={clsx("label-text text-base font-semibold", {
                "text-error": error !== undefined,
              })}
            >
              {label}
            </span>
          </label>
        ) : null}
        <div
          className={clsx("w-full", {
            join: prefix !== undefined || suffix !== undefined,
          })}
        >
          {prefix !== undefined ? prefix : null}
          <input
            ref={ref}
            type={type}
            className={clsx(
              "input w-full",
              size && `input-${size}`,
              color && `input-${color}`,
              {
                "input-bordered": bordered,
                "input-ghost": ghost,
                "input-error": error !== undefined,
                "join-item": prefix !== undefined || suffix !== undefined,
              }
            )}
            id={resolvedId}
            aria-invalid={error !== undefined}
            aria-describedby={
              error !== undefined ? `${resolvedId}-error` : undefined
            }
            {...rest}
          />
          {suffix !== undefined ? suffix : null}
        </div>
        {error !== undefined ? (
          <label htmlFor={resolvedId} className="label">
            <span className="label-text text-error" id={`${resolvedId}-error`}>
              {error}
            </span>
          </label>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
