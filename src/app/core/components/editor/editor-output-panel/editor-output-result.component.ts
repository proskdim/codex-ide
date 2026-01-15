import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SubmissionService } from '@app/core/services/submission.service';
import { JUDGE0_STATUS } from '@app/core/types/judge0.types';
import { LucideAngularModule, Clock, Cpu } from 'lucide-angular';
import { Base64DecodePipe } from '@app/shared/pipes/base64-decode.pipe';

/**
 * Component for displaying the execution result in the terminal.
 */
@Component({
  selector: 'app-editor-output-result',
  imports: [LucideAngularModule, Base64DecodePipe],
  template: `
    @if (isSubmitting()) {
    <div class="flex flex-col items-center justify-center py-12 text-base-content/50">
      <span class="loading loading-spinner loading-lg mb-4 text-primary"></span>
      <p class="text-sm font-medium animate-pulse">Executing your code...</p>
    </div>
    } @else if (submissionResult(); as result) {
    <div class="space-y-6 flex flex-col">
      <div
        class="flex items-center justify-between bg-base-200/50 p-3 rounded-lg border border-base-300"
      >
        <div class="flex items-center gap-3">
          <span
            class="badge badge-md font-bold px-4 py-3"
            [class]="getStatusClass(result.status.id)"
          >
            {{ result.status.description }}
          </span>
        </div>
        <div class="flex gap-4 text-[10px] font-mono opacity-60">
          <span class="flex items-center gap-1">
            <lucide-icon [name]="ClockIcon" class="h-3 w-3"></lucide-icon>
            {{ result.time }}s
          </span>
          <span class="flex items-center gap-1">
            <lucide-icon [name]="CpuIcon" class="h-3 w-3"></lucide-icon>
            {{ result.memory }} KB
          </span>
        </div>
      </div>

      @if (result.compile_output) {
      <div class="space-y-2">
        <p class="text-[10px] font-black uppercase tracking-wider opacity-40 text-error">
          Compilation Error
        </p>
        <div class="alert alert-error bg-error/5 border-error/20 p-4 text-sm rounded-lg">
          <pre
            class="whitespace-pre-wrap font-mono text-xs"
          ><code>{{ result.compile_output | base64Decode }}</code></pre>
        </div>
      </div>
      } @if (result.message) {
      <div class="space-y-2">
        <p class="text-[10px] font-black uppercase tracking-wider opacity-40">System Message</p>
        <div class="alert alert-info bg-info/5 border-info/20 p-4 text-sm rounded-lg">
          <span class="font-mono text-xs">{{ result.message | base64Decode }}</span>
        </div>
      </div>
      } @if (result.stdout) {
      <div class="space-y-2">
        <p class="text-[10px] font-black uppercase tracking-wider opacity-40 text-primary">
          Standard Output
        </p>
        <div class="bg-primary/5 text-primary rounded-lg p-4 shadow-inner border border-primary/20">
          <pre
            class="font-mono text-xs leading-relaxed"
          ><code>{{ result.stdout | base64Decode }}</code></pre>
        </div>
      </div>
      } @if (result.stderr) {
      <div class="space-y-2">
        <p class="text-[10px] font-black uppercase tracking-wider opacity-40 text-error">
          Standard Error
        </p>
        <div class="alert alert-neutral bg-base-300 border-base-300 p-4 text-sm rounded-lg">
          <pre
            class="text-error font-mono text-xs leading-relaxed"
          ><code>{{ result.stderr | base64Decode }}</code></pre>
        </div>
      </div>
      }
    </div>
    } @else {
    <div
      class="flex flex-col h-full items-center justify-center text-primary/30 py-6 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5"
    >
      <p class="text-center text-sm font-bold tracking-wide uppercase">No results yet</p>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorOutputResultComponent {
  // Submission service.
  private readonly submissionService = inject(SubmissionService);

  // Clock icon.
  readonly ClockIcon = Clock;
  // CPU icon.
  readonly CpuIcon = Cpu;

  // Whether the code is currently being submitted.
  readonly isSubmitting = this.submissionService.isSubmitting;

  // The result of the code submission.
  readonly submissionResult = this.submissionService.submissionResult;

  // Gets the CSS class for the submission status badge.
  getStatusClass(statusId: number): string {
    switch (statusId) {
      case JUDGE0_STATUS.ACCEPTED:
        return 'badge-success';
      case JUDGE0_STATUS.WRONG_ANSWER:
        return 'badge-warning';
      case JUDGE0_STATUS.COMPILATION_ERROR:
        return 'badge-error';
      default:
        return 'badge-ghost';
    }
  }
}
