export interface CreateSubmissionData {
  source_code: string;
  language_id: string;
}

export interface CreateSubmissionResponse {
  token: string;
}

export interface SubmissionResult {
  stdout: string | null;
  time: string;
  memory: number;
  stderr: string | null;
  token: string;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
}
