"use client";
import { FormProvider, useForm } from "react-hook-form";

export const ReusableForm = ({
  children,
  onSubmit,
  resolver,
  defaultValues,
}: {
  children: React.ReactNode;
  onSubmit: (values: any) => Promise<void> | void;
  resolver?: any;
  defaultValues?: any;
}) => {
  const methods = useForm({
    resolver,
    defaultValues,
  });

  const handleSubmit = async (values: any) => {
    await onSubmit(values); // wait for success
    methods.reset(defaultValues); // reset form
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>{children}</form>
    </FormProvider>
  );
};
