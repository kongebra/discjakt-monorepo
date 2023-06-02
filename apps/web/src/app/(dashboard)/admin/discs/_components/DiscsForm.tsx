import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import { slugify } from "@/utils/slug";
import { Brand, DiscType } from "database";
import Image from "next/image";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";

export type DiscFormData = {
  name: string;
  slug: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  brandId: number;
  imageUrl: string;
  type: DiscType;
};

type Props = {
  onSubmit: (data: DiscFormData) => void;
  defaultValues?: Partial<DiscFormData>;
  brands: Brand[];
  isLoading?: boolean;
};

const DiscsForm: React.FC<Props> = ({
  onSubmit,
  defaultValues,
  brands,
  isLoading,
}) => {
  const form = useForm<DiscFormData>({ defaultValues, mode: "onChange" });

  const brandOptions = useMemo(
    () =>
      brands
        .map((brand) => ({ label: brand.name, value: brand.id }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [brands]
  );

  const imageUrlWatch: string | undefined = form.watch("imageUrl");

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

      <div className="grid grid-cols-4 gap-2">
        <Input
          type="number"
          label="Speed"
          placeholder="Speed"
          {...form.register("speed", {
            required: "Speed er påkrevd",
            valueAsNumber: true,
          })}
          error={form.formState.errors?.speed?.message}
          step={0.5}
        />
        <Input
          type="number"
          label="Glide"
          placeholder="Glide"
          {...form.register("glide", {
            required: "Glide er påkrevd",
            valueAsNumber: true,
          })}
          error={form.formState.errors?.glide?.message}
          step={0.5}
        />
        <Input
          type="number"
          label="Turn"
          placeholder="Turn"
          {...form.register("turn", {
            required: "Turn er påkrevd",
            valueAsNumber: true,
          })}
          error={form.formState.errors?.turn?.message}
          step={0.5}
        />
        <Input
          type="number"
          label="Fade"
          placeholder="Fade"
          {...form.register("fade", {
            required: "Fade er påkrevd",
            valueAsNumber: true,
          })}
          error={form.formState.errors?.fade?.message}
          step={0.5}
        />
      </div>

      <Select
        label="Type"
        options={[
          {
            label: "Putter",
            value: "Putter",
          },
          {
            label: "Midrange",
            value: "Midrange",
          },
          {
            label: "Fairway Driver",
            value: "FairwayDriver",
          },
          {
            label: "Distance Driver",
            value: "DistanceDriver",
          },
        ]}
        {...form.register("type", { required: "Type er påkrevd" })}
        error={form.formState.errors?.type?.message}
      />

      <Select
        label="Merke"
        options={brandOptions}
        {...form.register("brandId", {
          required: "Merke er påkrevd",
          valueAsNumber: true,
        })}
        error={form.formState.errors?.brandId?.message}
      />

      <Input
        label="Bilde URL"
        placeholder="Bilde URL"
        {...form.register("imageUrl", {
          required: "Bilde URL er påkrevd",
        })}
        error={form.formState.errors?.imageUrl?.message}
        className="mb-2"
      />

      <p className="mb-2">
        <strong>Preview</strong>
      </p>

      <div className="rounded-lg border w-full aspect-square overflow-hidden">
        {imageUrlWatch ? (
          <Image
            src={imageUrlWatch}
            width={512}
            height={512}
            alt="Image preview"
          />
        ) : null}
      </div>

      <div className="mb-4"></div>

      <Button
        type="submit"
        color="primary"
        loading={isLoading}
        disabled={isLoading}
      >
        Submit
      </Button>
    </form>
  );
};

export default DiscsForm;
