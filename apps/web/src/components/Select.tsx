import clsx from "clsx";
import React, { useId } from "react";
import Option from "./Option";

export type SelectOption = {
  label: React.ReactNode;
  value: string | number | readonly string[];
};

export type SelectOptionGroup = {
  label: string;
  options: SelectOption[];
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: (SelectOption | SelectOptionGroup)[];
  error?: React.ReactNode;
  label?: React.ReactNode;
  bordered?: boolean;
  ghost?: boolean;
  color?:
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";
  size?: "xs" | "sm" | "md" | "lg";
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      className,
      options,
      label,
      error,
      bordered = true,
      ghost,
      color,
      size,
      ...rest
    },
    ref
  ) => {
    const internalId = useId();
    const resolvedId = id ?? internalId;

    return (
      <div className="form-control">
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

        <select
          ref={ref}
          id={resolvedId}
          className={clsx(
            "select",
            color && `select-${color}`,
            size && `select-${size}`,
            {
              "select-bordered": bordered,
              "select-ghost": ghost,
            },
            className
          )}
          {...rest}
        >
          {options?.map((option, index) => (
            <Option key={index} option={option} />
          ))}
        </select>

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

Select.displayName = "Select";

export default Select;
