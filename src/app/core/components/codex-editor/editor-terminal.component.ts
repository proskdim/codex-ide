import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { SubmissionResult } from '@app/core/models/judge0.model';
import { TerminalTestCasesComponent } from './terminal-test-cases.component';
import { TerminalResultComponent } from './terminal-result.component';

/**
 * Terminal component for the Codex Editor.
 * Displays test cases and results, and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-terminal',
  imports: [TerminalTestCasesComponent, TerminalResultComponent],
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
          (click)="onToggleCollapse()"
          class="btn btn-ghost btn-xs text-base-content/50"
          [title]="isCollapsed() ? 'Expand' : 'Collapse'"
        >
          <span class="text-lg">{{ isCollapsed() ? '↑' : '↓' }}</span>
        </button>
      </div>
      @if (!isCollapsed()) {
      <div class="card-body overflow-auto p-4">
        @if (activeTab() === 'test-cases') {
        <app-terminal-test-cases />
        } @else {
        <app-terminal-result
          [isSubmitting]="isSubmitting()"
          [submissionResult]="submissionResult()"
        />
        }
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

  // Handles the collapse toggle click event.
  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }
}
