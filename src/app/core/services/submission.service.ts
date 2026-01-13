import { inject, Injectable, signal } from '@angular/core';
import { Judge0Service } from './judge/judge0';
import { Submission, SubmissionResult } from '@app/core/types/judge0.types';
import { finalize } from 'rxjs';

/**
 * Service for managing the state and execution of code submissions.
 */
@Injectable({
  providedIn: 'root',
})
export class SubmissionService {
  private readonly judge0 = inject(Judge0Service);

  // Submission state.
  readonly isSubmitting = signal<boolean>(false);

  // Result of the submission.
  readonly submissionResult = signal<SubmissionResult | null>(null);

  /**
   * Executes the provided submission data using Judge0.
   * Updates the isSubmitting and submissionResult signals accordingly.
   */
  execute(data: Submission): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submissionResult.set(null);

    this.judge0
      .execute(data)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (result: SubmissionResult) => {
          this.submissionResult.set(result);
        },
        error: (error: unknown) => {
          console.error('Submission failed:', error);
          this.submissionResult.set(null);
        },
      });
  }
}
