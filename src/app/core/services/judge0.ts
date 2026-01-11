import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Judge0Language,
  Judge0SubmissionDetails,
  Judge0SubmissionResponse,
} from './judge0.types';

/**
 * Service for interacting with the Judge0 API via RapidAPI.
 */
@Injectable({
  providedIn: 'root',
})
export class Judge0 {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'https://judge029.p.rapidapi.com';

  private readonly rapidapiKey = 'd26a5cc027msh524b0630ab98aaap133da9jsnb5234d4b9a1e';

  private readonly rapidapiHost = 'judge029.p.rapidapi.com';

  /**
   * Retrieves the list of supported programming languages from Judge0.
   * @returns An Observable containing the list of languages.
   */
  getLanguages(): Observable<Judge0Language[]> {
    return this.http.get<Judge0Language[]>(`${this.baseUrl}/languages`, {
      headers: {
        'x-rapidapi-key': this.rapidapiKey,
        'x-rapidapi-host': this.rapidapiHost,
      },
    });
  }

  /**
   * Creates a new submission in Judge0.
   * @param sourceCode The source code to execute.
   * @param languageId The ID of the programming language.
   * @param stdin The standard input for the execution.
   * @param expectedOutput The expected standard output.
   * @returns An Observable containing the submission response (token).
   */
  createSubmission(
    sourceCode: string,
    languageId: string,
    stdin: string,
    expectedOutput: string
  ): Observable<Judge0SubmissionResponse> {
    return this.http.post<Judge0SubmissionResponse>(
      `${this.baseUrl}/submissions`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin,
        expected_output: expectedOutput,
      },
      {
        headers: {
          'x-rapidapi-key': this.rapidapiKey,
          'x-rapidapi-host': this.rapidapiHost,
        },
        params: {
          base64_encoded: 'true',
          wait: 'false',
          fields: '*',
        },
      }
    );
  }

  /**
   * Retrieves the details of a specific submission from Judge0.
   * @param submissionId The ID of the submission to retrieve.
   * @returns An Observable containing the submission details.
   */
  getSubmission(submissionId: string): Observable<Judge0SubmissionDetails> {
    return this.http.get<Judge0SubmissionDetails>(`${this.baseUrl}/submissions/${submissionId}`, {
      headers: {
        'x-rapidapi-key': this.rapidapiKey,
        'x-rapidapi-host': this.rapidapiHost,
      },
      params: {
        base64_encoded: 'true',
        wait: 'false',
        fields: '*',
      },
    });
  }
}
