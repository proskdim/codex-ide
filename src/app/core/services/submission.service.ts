import { inject, Injectable, signal } from '@angular/core';
import { Judge0Service } from './judge/judge0';
import { Judge0Request, Judge0Response } from '@app/core/types/judge0.types';
import { finalize } from 'rxjs';

/**
 * Service for managing the state and execution of code submissions.
 */
@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  // Judge0 service.
  private readonly judge0 = inject(Judge0Service);

  // Indicates if the submission is in progress.
  private readonly _isSubmitting = signal<boolean>(false);
  readonly isSubmitting = this._isSubmitting.asReadonly();

  // The result of the submission.
  private readonly _submissionResult = signal<Judge0Response | null>(null);
  readonly submissionResult = this._submissionResult.asReadonly();

  // The error message of the submission.
  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  // Executes the submission data using Judge0.
  execute(data: Judge0Request): void {
    this.prepareStateForRun();

    this.judge0
      .execute(data)
      .pipe(finalize(() => this.cleanupAfterRun()))
      .subscribe({
        next: (result: Judge0Response) => {
          this.handleSuccess(result);
        },
        error: (error: unknown) => {
          this.handleError(error);
        },
      });
  }

  // Prepares the state for the submission.
  private prepareStateForRun(): void {
    this._isSubmitting.set(true);
    this._submissionResult.set(null);
    this._error.set(null);
  }

  // Cleans up the state after the submission.
  private cleanupAfterRun(): void {
    this._isSubmitting.set(false);
  }

  // Handles the successful result of the submission.
  private handleSuccess(result: Judge0Response): void {
    this._submissionResult.set(result);
  }

  // Handles the error result of the submission.
  private handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Submission failed';
    this._error.set(message);
    this._submissionResult.set(null);
  }
}
