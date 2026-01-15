import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { Judge0Response, Judge0Request } from '@app/core/types/judge0.types';
import { Judge0ValidatorService } from './validator';
import { Judge0ClientService } from './client';

/**
 * Service for interacting with the Judge0 API via RapidAPI.
 */
@Injectable({
  providedIn: 'root',
})
export class Judge0Service {
  // The timeout for the submission in milliseconds.
  private readonly EXECUTION_TIMEOUT_MS = 60000;
  // The endpoint for the submissions.
  private readonly SUBMISSIONS_ENDPOINT = '/submissions';

  // The error messages.
  private readonly ERRORS = {
    TIMEOUT: 'Submission timed out',
    EXECUTION_FAILED: (msg: string) => `Failed to execute code: ${msg}`,
    UNKNOWN: 'Unknown error occurred',
  };

  // The Judge0 client service.
  private readonly client = inject(Judge0ClientService);
  // The Judge0 validator service.
  private readonly validator = inject(Judge0ValidatorService);

  // The base parameters for the submissions.
  private readonly baseParams = new HttpParams({
    fromObject: {
      base64_encoded: 'true',
      wait: 'true',
      fields: '*',
    },
  });

  // Executes the code and waits for the result.
  execute(input: Judge0Request): Observable<Judge0Response> {
    return this.submit(this.buildBody(input)).pipe(
      timeout({
        each: this.EXECUTION_TIMEOUT_MS,
        with: () => throwError(() => new Error(this.ERRORS.TIMEOUT)),
      }),
      catchError((error) => {
        const message = error instanceof Error ? error.message : this.ERRORS.UNKNOWN;
        return throwError(() => new Error(this.ERRORS.EXECUTION_FAILED(message)));
      })
    );
  }

  // Submits the code to the Judge0 API and waits for the result.
  private submit(body: Judge0Request): Observable<Judge0Response> {
    return this.client
      .post<Judge0Response>(this.SUBMISSIONS_ENDPOINT, body, this.baseParams)
      .pipe(map((response) => this.validator.validateResponse(response)));
  }

  // Builds the submission body and handles encoding.
  private buildBody(input: Judge0Request): Judge0Request {
    const data = this.validator.validateRequest(input);
    return {
      ...data,
      source_code: btoa(data.source_code ?? ''),
      expected_output: btoa(data.expected_output ?? ''),
    };
  }
}
