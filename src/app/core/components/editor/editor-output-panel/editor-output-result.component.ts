import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SubmissionService } from '@app/core/services/submission.service';
import { JUDGE0_STATUS, Judge0Response } from '@app/core/types/judge0.types';
import { LucideAngularModule, Clock, Cpu } from 'lucide-angular';
import { Base64DecodePipe } from '@app/shared/pipes/base64-decode.pipe';
/**
 * Component for displaying the loading state.
 */
@Component({
  selector: 'app-editor-output-loading',
  imports: [LucideAngularModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 text-base-content/50">
      <span class="loading loading-spinner loading-lg mb-4 text-primary"></span>
      <p class="text-sm font-medium animate-pulse">Executing your code...</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorOutputLoadingComponent {}

/**
 * Component for displaying the "no results" state.
 */
@Component({
  selector: 'app-editor-no-results',
  imports: [LucideAngularModule],
  template: `
    <div
      class="flex flex-col h-full items-center justify-center text-primary/30 py-6 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5"
    >
      <p class="text-center text-sm font-bold tracking-wide uppercase">No results yet</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorNoResultsComponent {}

/**
 * Component for displaying the execution details (stdout, stderr, compile_output, message).
 */
@Component({
  selector: 'app-editor-output-details',
  imports: [Base64DecodePipe],
  template: `
    @switch (statusId()) { @case (JUDGE0_STATUS.COMPILATION_ERROR) {
    <div class="space-y-2">
      <p class="text-[10px] font-black uppercase tracking-wider opacity-40 text-error">
        Compilation Error
      </p>
      <div class="alert alert-error bg-error/5 border-error/20 p-4 text-sm rounded-lg">
        <pre
          class="whitespace-pre-wrap font-mono text-xs"
        ><code>{{ compileOutput() | base64Decode }}</code></pre>
      </div>
    </div>
    } @case (JUDGE0_STATUS.ACCEPTED) {
    <div class="space-y-2">
      <p class="text-[10px] font-black uppercase tracking-wider opacity-40 text-primary">
        Standard Output
      </p>
      <div class="bg-primary/5 text-primary rounded-lg p-4 shadow-inner border border-primary/20">
        <pre
          class="font-mono text-xs leading-relaxed"
        ><code>{{ stdout() | base64Decode }}</code></pre>
      </div>
    </div>
    } @case (JUDGE0_STATUS.WRONG_ANSWER) {
    <div class="space-y-2">
      <p class="text-[10px] font-black uppercase tracking-wider opacity-40 text-error">
        Standard Error
      </p>
      <div class="alert alert-neutral bg-base-300 border-base-300 p-4 text-sm rounded-lg">
        <pre
          class="text-error font-mono text-xs leading-relaxed"
        ><code>{{ stdout() | base64Decode }}</code></pre>
      </div>
    </div>
    } } @if (message()) {
    <div class="space-y-2 mt-4">
      <p class="text-[10px] font-black uppercase tracking-wider opacity-40">System Message</p>
      <div class="alert alert-info bg-info/5 border-info/20 p-4 text-sm rounded-lg">
        <span class="font-mono text-xs">{{ message() | base64Decode }}</span>
      </div>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorOutputDetailsComponent {
  // Judge0 status enum.
  readonly JUDGE0_STATUS = JUDGE0_STATUS;
  // The result of the code submission.
  readonly result = input.required<Judge0Response>();
  // The status ID.
  readonly statusId = computed(() => this.result().status.id);
  // Standard output.
  readonly stdout = computed(() => this.result().stdout);
  // Standard error.
  readonly stderr = computed(() => this.result().stderr);
  // Compile output.
  readonly compileOutput = computed(() => this.result().compile_output);
  // Message.
  readonly message = computed(() => this.result().message);
}

/**
 * Component for displaying the execution result header and details.
 */
@Component({
  selector: 'app-editor-output-result',
  imports: [LucideAngularModule, EditorOutputDetailsComponent],
  template: `
    <div class="space-y-6 flex flex-col">
      <div
        class="flex items-center justify-between bg-base-200/50 p-3 rounded-lg border border-base-300"
      >
        <div class="flex items-center gap-3">
          @switch (statusId()) { @case (JUDGE0_STATUS.COMPILATION_ERROR) {
          <span class="badge badge-md font-bold px-4 py-3 badge-error">
            {{ description() }}
          </span>
          } @case (JUDGE0_STATUS.ACCEPTED) {
          <span class="badge badge-md font-bold px-4 py-3 badge-success">
            {{ description() }}
          </span>
          } @case (JUDGE0_STATUS.WRONG_ANSWER) {
          <span class="badge badge-md font-bold px-4 py-3 badge-warning">
            {{ description() }}
          </span>
          } @default {
          <span class="badge badge-md font-bold px-4 py-3 badge-ghost">
            {{ description() }}
          </span>
          } }
        </div>
        <div class="flex gap-4 text-[10px] font-mono opacity-60">
          <span class="flex items-center gap-1">
            <lucide-icon [name]="ClockIcon" class="h-3 w-3"></lucide-icon>
            {{ time() }}s
          </span>
          <span class="flex items-center gap-1">
            <lucide-icon [name]="CpuIcon" class="h-3 w-3"></lucide-icon>
            {{ memory() }} KB
          </span>
        </div>
      </div>

      <app-editor-output-details [result]="result()" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorOutputResultComponent {
  // The result of the code submission.
  readonly result = input.required<Judge0Response>();
  // Clock icon.
  readonly ClockIcon = Clock;
  // CPU icon.
  readonly CpuIcon = Cpu;
  // Judge0 status enum.
  readonly JUDGE0_STATUS = JUDGE0_STATUS;
  // The description of the status (e.g. "Accepted", "Wrong Answer", "Compilation Error").
  readonly description = computed(() => this.result().status.description ?? '');
  // The status ID.
  readonly statusId = computed(() => this.result().status.id);
  // The time taken to execute the code.
  readonly time = computed(() => this.result().time);
  // The memory used to execute the code.
  readonly memory = computed(() => this.result().memory);
}

/**
 * Main container component for the output panel.
 */
@Component({
  selector: 'app-editor-output-results',
  imports: [EditorOutputLoadingComponent, EditorNoResultsComponent, EditorOutputResultComponent],
  template: `
    @if (isSubmitting()) {
    <app-editor-output-loading />
    } @else if (submissionResult(); as result) {
    <app-editor-output-result [result]="result" />
    } @else {
    <app-editor-no-results />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorOutputResultsComponent {
  // Submission service.
  private readonly submissionService = inject(SubmissionService);
  // Whether the code is currently being submitted.
  readonly isSubmitting = this.submissionService.isSubmitting;
  // The result of the code submission.
  readonly submissionResult = this.submissionService.submissionResult;
}
