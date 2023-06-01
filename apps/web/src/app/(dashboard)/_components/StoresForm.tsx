import Button from "@/components/Button";
import Input from "@/components/Input";
import { slugify } from "@/utils/slug";
import React from "react";
import { useForm } from "react-hook-form";

type FormData = {
  name: string;
  url: string;
  slug: string;
};

type Props = {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
};

const StoresForm: React.FC<Props> = ({ onSubmit, defaultValues }) => {
  const form = useForm<FormData>({ defaultValues, mode: "onChange" });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
      <Input
        label="Navn"
        placeholder="Navn"
        {...form.register("name", {
          required: "Navn er påkrevd",
        })}
        error={form.formState.errors?.name?.message}
      />

      <Input
        label="Slug"
        placeholder="Slug"
        {...form.register("slug", {
          required: "Slug er påkrevd",
        })}
        error={form.formState.errors?.slug?.message}
        className="join-item"
        suffix={
          <Button
            type="button"
            className="join-item"
            onClick={() => {
              form.setValue("slug", slugify(form.getValues("name")));
            }}
          >
            Slugify
          </Button>
        }
      />

      <Input
        label="URL"
        placeholder="URL"
        {...form.register("url", {
          required: "URL er påkrevd",
        })}
        error={form.formState.errors?.url?.message}
        className="mb-4"
      />

      <Button type="submit" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default StoresForm;
