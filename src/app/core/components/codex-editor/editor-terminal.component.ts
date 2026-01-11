import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { SubmissionResult } from '@app/core/models/judge0.model';

/**
 * Terminal component for the Codex Editor.
 * Displays test cases and results, and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-terminal',
  template: `
    <section
      class="card card-compact h-full overflow-hidden rounded-xl border border-base-300 bg-base-100"
    >
      <div
        class="flex shrink-0 items-center justify-between border-b border-base-300 bg-base-200/50 text-sm font-bold"
      >
        <div role="tablist" class="tabs tabs-bordered tabs-sm px-2">
          <input
            type="radio"
            name="terminal_tabs"
            role="tab"
            class="tab"
            aria-label="Test cases"
            [checked]="activeTab() === 'test-cases'"
            (change)="activeTab.set('test-cases')"
          />
          <input
            type="radio"
            name="terminal_tabs"
            role="tab"
            class="tab"
            aria-label="Result"
            [checked]="activeTab() === 'result'"
            (change)="activeTab.set('result')"
          />
        </div>
        <button
          (click)="toggleCollapse.emit()"
          class="btn btn-ghost btn-xs text-base-content/50"
          [title]="isCollapsed() ? 'Expand' : 'Collapse'"
        >
          <span class="text-lg">{{ isCollapsed() ? '↑' : '↓' }}</span>
        </button>
      </div>
      @if (!isCollapsed()) {
      <div class="card-body overflow-auto p-4">
        @if (activeTab() === 'test-cases') { test cases } @else { @if (isSubmitting()) {
        <div class="flex flex-col items-center justify-center py-8 text-base-content/50">
          <span class="loading loading-spinner loading-md mb-2"></span>
          <p>Executing code...</p>
        </div>
        } @else if (submissionResult(); as result) {
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="badge" [class]="result.status.id === 3 ? 'badge-success' : 'badge-error'">
              {{ result.status.description }}
            </span>
            <span class="text-xs text-base-content/50">
              {{ result.time }}s | {{ result.memory }} KB
            </span>
          </div>

          @if (result.stdout) {
          <div class="space-y-1">
            <p class="text-xs font-bold uppercase opacity-50">Output</p>
            <pre><code>{{ decodeBase64(result.stdout) }}</code></pre>
          </div>
          } @if (result.stderr) {
          <div class="space-y-1">
            <p class="text-xs font-bold uppercase text-error opacity-50">Error</p>
            <div class="mockup-code bg-error/10 text-error shadow-inner">
              <pre><code>{{ decodeBase64(result.stderr) }}</code></pre>
            </div>
          </div>
          } @if (result.message) {
          <div class="space-y-1">
            <p class="text-xs font-bold uppercase opacity-50">Message</p>
            <div class="alert alert-info py-2 text-sm">
              <span>{{ result.message }}</span>
            </div>
          </div>
          }
        </div>
        } @else {
        <div class="flex h-full text-base-content/30">
          <p>No results. Submit your code to see the output.</p>
        </div>
        } }
      </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorTerminalComponent {
  // Whether the terminal section is collapsed.
  readonly isCollapsed = input.required<boolean>();

  // Whether the code is currently being submitted.
  readonly isSubmitting = input<boolean>(false);

  // The result of the code submission.
  readonly submissionResult = input<SubmissionResult | null>(null);

  // The currently active tab.
  readonly activeTab = model<'test-cases' | 'result'>('test-cases');

  // Emits when the collapse toggle is clicked.
  readonly toggleCollapse = output<void>();

  // Decodes a base64 string.
  decodeBase64(value: string): string {
    try {
      return atob(value);
    } catch {
      return value;
    }
  }
}
