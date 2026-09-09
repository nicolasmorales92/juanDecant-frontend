import { z } from "zod";

export const validarZodFormik = (schema: z.ZodTypeAny) => (values: any) => {
  const result = schema.safeParse(values);
  if (result.success) return {};

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = String(issue.path[0]);
    if (path) errors[path] = issue.message;
  });
  return errors;
};