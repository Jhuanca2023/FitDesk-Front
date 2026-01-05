import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido."),
  lastName: z.string().min(1, "El apellido es requerido."),
  dni: z
    .string()
    .min(1, "El DNI es requerido.")
    .regex(/^\d{8,9}$/, "El DNI debe tener entre 8 y 9 dígitos."),
  phone: z
    .string()
    .min(1, "El teléfono es requerido.")
    .regex(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
      "El formato del teléfono no es válido.",
    ),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
