"use client";

import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { updateUserPaymentMethod } from "@/lib/actions/user.actions";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: { type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD },
  });

  // Submit Handler
  async function onSubmit(value: z.infer<typeof paymentMethodSchema>) {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(value);

      if (!res.success) {
        toast.error(res.message);

        return;
      }
      router.push("place-order");
    });
  }
  return (
    <>
      <CheckoutSteps current={2} />
      <div className="max-w-md mx-auto">
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <h1 className="h2-bold mt-4">Payment Method</h1>
          <p className="text-sm text-muted-foreground">
            Please select your preferred payment method
          </p>
          <div className="flex flex-col gap-5 md:flex-row">
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <FieldSet>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-col space-y-2"
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <Field
                        key={method}
                        orientation={"horizontal"}
                        data-invalid={fieldState.invalid}
                      >
                        <RadioGroupItem
                          value={method}
                          id={method}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldLabel htmlFor={method} className="font-normal">
                          {method}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            ></Controller>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentMethodForm;
