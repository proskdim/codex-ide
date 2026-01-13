import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  filter,
  interval,
  map,
  Observable,
  switchMap,
  takeWhile,
  throwError,
  timeout,
} from 'rxjs';
import {
  SubmissionSchema,
  JUDGE0_STATUS,
  SubmissionResult,
  SubmissionResultSchema,
  Submission,
  SubmissionToken,
  SubmissionTokenSchema,
} from '@app/core/types/judge0.types';
import { Judge0ValidatorService } from './validator';
import { Judge0ClientService } from './client';

const submissionParams = new HttpParams({
  fromObject: {
    base64_encoded: 'true',
    wait: 'false',
    fields: '*',
  },
});

const submissionResultParams = new HttpParams({
  fromObject: {
    base64_encoded: 'true',
    fields: '*',
  },
});

/**
 * Service for interacting with the Judge0 API via RapidAPI.
 */
@Injectable({
  providedIn: 'root',
})
export class Judge0Service {
  // Inject the Judge0 HTTP and validator services.
  private readonly judge0Client = inject(Judge0ClientService);
  // Inject the Judge0 validator service.
  private readonly judge0Validator = inject(Judge0ValidatorService);
  // Polling interval in milliseconds.
  private readonly INTERVAL_MS = 2000;
  // Timeout in milliseconds.
  private readonly TIMEOUT_MS = 60000;

  // Submits code and polls for the result until it's finished.
  execute(data: Submission): Observable<SubmissionResult> {
    const validatedData = this.judge0Validator.call(SubmissionSchema, data, 'CreateSubmission');

    const submissionData: Submission = {
      ...validatedData,
      source_code: btoa(validatedData.source_code),
      expected_output: validatedData.expected_output ? btoa(validatedData.expected_output) : undefined,
    };

    return this.createSubmission(submissionData).pipe(
      switchMap((response) => this.pollSubmission(response.token)),
      timeout({
        each: this.TIMEOUT_MS,
        with: () => throwError(() => new Error('Submission timed out')),
      }),
      catchError((error) => {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return throwError(() => new Error(`Failed to execute code: ${message}`));
      })
    );
  }

  // Creates a new code submission.
  createSubmission(data: Submission): Observable<SubmissionToken> {
    return this.judge0Client
      .post<SubmissionToken>('/submissions', data, submissionParams)
      .pipe(
        map((response) =>
          this.judge0Validator.call(SubmissionTokenSchema, response, 'CreateSubmission')
        )
      );
  }

  // Retrieves the status and result of a submission.
  getSubmission(submissionId: string): Observable<SubmissionResult> {
    return this.judge0Client
      .get<SubmissionResult>(`/submissions/${submissionId}`, submissionResultParams)
      .pipe(
        map((response) =>
          this.judge0Validator.call(SubmissionResultSchema, response, 'SubmissionResult')
        )
      );
  }

  // Polls the submission status until it reaches a terminal state.
  private pollSubmission(token: string): Observable<SubmissionResult> {
    return interval(this.INTERVAL_MS).pipe(
      switchMap(() => this.getSubmission(token)),
      takeWhile((result) => result.status.id <= JUDGE0_STATUS.PROCESSING, true),
      filter((result) => result.status.id > JUDGE0_STATUS.PROCESSING)
    );
  }
}
