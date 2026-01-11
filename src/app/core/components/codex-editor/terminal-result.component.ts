import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SubmissionResult } from '@app/core/models/judge0.model';

/**
 * Component for displaying the execution result in the terminal.
 */
@Component({
  selector: 'app-terminal-result',
  template: `
    @if (isSubmitting()) {
    <div class="flex flex-col items-center justify-center py-8 text-base-content/50">
      <span class="loading loading-spinner loading-md mb-2"></span>
      <p>Executing code...</p>
    </div>
    } @else if (submissionResult(); as result) {
    <div class="space-y-2 flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span class="badge" [class]="result.status.id === 3 ? 'badge-success' : 'badge-error'">
          {{ result.status.description }}
        </span>
        <span class="text-xs opacity-50"> {{ result.time }}s | {{ result.memory }} KB </span>
      </div>
      @if (result.message) {
      <div class="space-y-1">
        <p class="text-xs font-bold uppercase opacity-50">Message</p>
        <div class="alert alert-info py-2 text-sm">
          <span>{{ decodeBase64(result.message) }}</span>
        </div>
      </div>
      } @if (result.stdout) {
      <div class="space-y-1">
        <p class="text-xs font-bold uppercase opacity-50">Output</p>
        <pre><code>{{ decodeBase64(result.stdout) }}</code></pre>
      </div>
      } @if (result.stderr) {
      <div class="space-y-1">
        <p class="text-xs font-bold uppercase opacity-50">Error</p>
        <div class="alert alert-neutral py-2 text-sm">
          <pre><code>{{ decodeBase64(result.stderr) }}</code></pre>
        </div>
      </div>
      }
    </div>
    } @else {
    <div class="flex h-full text-base-content/30">
      <p>No results. Submit your code to see the output.</p>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalResultComponent {
  // Whether the code is currently being submitted.
  readonly isSubmitting = input<boolean>(false);

  // The result of the code submission.
  readonly submissionResult = input<SubmissionResult | null>(null);

  // Decodes a base64 string.
  decodeBase64(value: string): string {
    try {
      return atob(value);
    } catch {
      return value;
    }
  }
}
