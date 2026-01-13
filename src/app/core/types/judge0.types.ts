import { z } from 'zod';

// Judge0 API status IDs.
export enum JUDGE0_STATUS {
  IN_QUEUE = 1,
  PROCESSING = 2,
  ACCEPTED = 3,
  WRONG_ANSWER = 4,
  TIME_LIMIT_EXCEEDED = 5,
  COMPILATION_ERROR = 6,
}

// Schema for Judge0 status object.
export const StatusSchema = z.object({
  id: z.enum(JUDGE0_STATUS),
  description: z.string(),
});

// Schema for creating a code submission.
export const SubmissionSchema = z.object({
  source_code: z.string().min(1, 'Source code is required'),
  language_id: z.number().int().positive('Language ID must be a positive integer'),
  expected_output: z.string().optional(),
});

// Schema for create submission response.
export const SubmissionTokenSchema = z.object({
  token: z.string(),
});

// Schema for submission result.
export const SubmissionResultSchema = z.object({
  stdout: z.string().nullable(),
  time: z
    .union([z.string(), z.number()])
    .nullable()
    .transform((v) => v?.toString() ?? null),
  memory: z
    .union([z.string(), z.number()])
    .nullable()
    .transform((v) => (typeof v === 'string' ? parseFloat(v) : v)),
  stderr: z.string().nullable(),
  token: z.string(),
  compile_output: z.string().nullable(),
  message: z.string().nullable(),
  status: StatusSchema,
});

// Type for submission.
export type Submission = z.infer<typeof SubmissionSchema>;

// Type for submission token.
export type SubmissionToken = z.infer<typeof SubmissionTokenSchema>;

// Type for submission result.
export type SubmissionResult = z.infer<typeof SubmissionResultSchema>;
