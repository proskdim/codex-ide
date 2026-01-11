/**
 * Represents a programming language supported by Judge0.
 */
export interface Judge0Language {
  id: number;
  name: string;
}

/**
 * Represents the status of a submission.
 */
export interface Judge0Status {
  id: number;
  description: string;
}

/**
 * Represents the response from creating a submission.
 */
export interface Judge0SubmissionResponse {
  token: string;
}

/**
 * Represents the details of a submission.
 */
export interface Judge0SubmissionDetails {
  stdout: string | null;
  time: string | null;
  memory: number | null;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: Judge0Status;
}
