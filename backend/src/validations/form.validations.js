import { z } from "zod";

export const createFormSchema = z.object({
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  fields: z.array(z.any()).min(1, "At least one field is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const publishFormSchema = z
  .object({
    id: z.string().min(1, "Form ID is required"),
    userIds: z.array(z.string()).optional(),
    status: z.string().optional(),
    maxSubmissions: z.number().int("Must be an integer").nullable().optional(),
    startDate: z
      .string()
      .nullable()
      .optional()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: "Invalid startDate format",
      }),
    endDate: z
      .string()
      .nullable()
      .optional()
      .refine((val) => !val || !isNaN(new Date(val).getTime()), {
        message: "Invalid endDate format",
      }),
    isPublic: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isPublic === false && (!data.userIds || data.userIds.length === 0)) {
      ctx.addIssue({
        path: ["userIds"],
        message: "User IDs are required when isPublic is false",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const updateFormSchema = z.object({
  id: z.string().min(1, "Form ID is required"),
  title: z.string().min(1, "Form title is required"),
  description: z.string().optional(),
  fields: z.array(z.any()).min(1, "At least one field is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const createSubmissionSchema = z.object({
  formId: z.string().min(1, "Form ID is required"),
  data: z.array(z.record(z.string(), z.any())).nonempty("Please fill the form"),
});


