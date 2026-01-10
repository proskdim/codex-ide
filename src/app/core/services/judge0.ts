import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Judge0 {
  private http = inject(HttpClient);  

  // base url for judge0
  private readonly baseUrl = 'https://judge029.p.rapidapi.com';

  // rapidapi key for judge0
  private readonly rapidapiKey = 'd26a5cc027msh524b0630ab98aaap133da9jsnb5234d4b9a1e';

  // rapidAPI host for judge0
  private readonly rapidapiHost = 'judge029.p.rapidapi.com';

  /**
   * Retrieves the list of supported programming languages from Judge0.
   * @returns An Observable containing the list of languages.
   */
  getLanguages(): import('rxjs').Observable<unknown> {
    return this.http.get(`${this.baseUrl}/languages`, {
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
   * @returns An Observable containing the submission details.
   */
  createSubmission(
    sourceCode: string,
    languageId: string,
    stdin: string,
    expectedOutput: string
  ): import('rxjs').Observable<unknown> {
    return this.http.post(
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
  getSubmission(submissionId: string): import('rxjs').Observable<unknown> {
    return this.http.get(`${this.baseUrl}/submissions/${submissionId}`, {
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
