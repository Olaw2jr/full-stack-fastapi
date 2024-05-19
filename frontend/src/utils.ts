import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)])[a-zA-Z0-9!@#\$%\^&\*\(\)]+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const signUpSchema = z
  .object({
    username: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)])[a-zA-Z0-9!@#\$%\^&\*\(\)]+$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      )
      .min(1, "Password is required"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\(\)])[a-zA-Z0-9!@#\$%\^&\*\(\)]+$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      )
      .min(1, "Password is required"),
    isTermsChecked: z.boolean().optional().default(false),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });



export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Invalid email address",
}

export const namePattern = {
  value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
  message: "Invalid name",
}

export const passwordRules = (isRequired = true) => {
  const rules: any = {
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
  }

  if (isRequired) {
    rules.required = "Password is required"
  }

  return rules
}

export const confirmPasswordRules = (
  getValues: () => any,
  isRequired = true,
) => {
  const rules: any = {
    validate: (value: string) => {
      const password = getValues().password || getValues().new_password
      return value === password ? true : "The passwords do not match"
    },
  }

  if (isRequired) {
    rules.required = "Password confirmation is required";
  }

  return rules;
}
