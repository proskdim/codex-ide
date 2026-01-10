import { Component, input, output } from '@angular/core';

/**
 * Terminal component for the Codex Editor.
 * Displays test cases and results, and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-terminal',
  standalone: true,
  template: `
    <section
      class="card card-compact h-full overflow-hidden rounded-xl border border-base-300 bg-base-100"
    >
      <div
        class="flex shrink-0 items-center border-b border-base-300 bg-base-200/50 text-sm font-bold"
        [class.justify-between]="!isCollapsed()"
        [class.justify-center]="isCollapsed()"
      >
        @if (!isCollapsed()) {
        <div role="tablist" class="tabs tabs-bordered tabs-sm px-2">
          <input
            type="radio"
            name="terminal_tabs"
            role="tab"
            class="tab"
            aria-label="Test cases"
            checked="checked"
          />
          <input
            type="radio"
            name="terminal_tabs"
            role="tab"
            class="tab"
            aria-label="Result"
          />
        </div>
        }
        <button
          (click)="toggleCollapse.emit()"
          class="btn btn-ghost btn-xs text-base-content/50"
          [title]="isCollapsed() ? 'Expand' : 'Collapse'"
        >
          <span class="text-lg">{{ isCollapsed() ? '↑' : '↓' }}</span>
        </button>
      </div>
      @if (!isCollapsed()) {
      <div class="card-body p-4">
        <div class="mockup-code bg-base-300 text-base-content shadow-inner">
          <pre data-prefix=">"><code>Running tests...</code></pre>
          <pre data-prefix=" " class="text-success"><code>Done!</code></pre>
        </div>
      </div>
      }
    </section>
  `,
})
export class EditorTerminalComponent {
  /** Whether the terminal section is collapsed. */
  readonly isCollapsed = input.required<boolean>();

  /** Emits when the collapse toggle is clicked. */
  readonly toggleCollapse = output<void>();
}
