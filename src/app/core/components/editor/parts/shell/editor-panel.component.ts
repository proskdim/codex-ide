import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EditorOutputComponent } from './editor-output.component';
import { EditorResultsComponent } from './editor-result.component';
import {
  LucideAngularModule,
  ClipboardList,
  Terminal,
  ChevronDown,
  ChevronUp,
} from 'lucide-angular';

/**
 * Terminal component for the Codex Editor.
 * Displays test cases and results, and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-panel',
  imports: [EditorOutputComponent, LucideAngularModule, EditorResultsComponent],
  template: `
    <section
      class="card card-compact h-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm"
    >
      <div
        class="flex shrink-0 items-center justify-between border-b border-base-300 bg-base-200/50 text-sm font-bold px-2"
      >
        <div role="tablist" class="tabs tabs-bordered tabs-sm">
          <button
            type="button"
            role="tab"
            class="tab h-10 px-4 transition-all"
            [class.tab-active]="activeTab() === 'test-cases'"
            [attr.aria-selected]="activeTab() === 'test-cases'"
            [attr.aria-controls]="activeTab() === 'test-cases' ? 'terminal-panel' : undefined"
            (click)="onActiveTabChange('test-cases')"
          >
            <span class="flex items-center gap-2">
              <lucide-icon [name]="TestCasesIcon" class="h-3.5 w-3.5"></lucide-icon>
              Test Cases
            </span>
          </button>
          <button
            type="button"
            role="tab"
            class="tab h-10 px-4 transition-all"
            [class.tab-active]="activeTab() === 'result'"
            [attr.aria-selected]="activeTab() === 'result'"
            [attr.aria-controls]="activeTab() === 'result' ? 'terminal-panel' : undefined"
            (click)="onActiveTabChange('result')"
          >
            <span class="flex items-center gap-2">
              <lucide-icon [name]="TerminalIcon" class="h-3.5 w-3.5"></lucide-icon>
              Result
            </span>
          </button>
        </div>
        <button
          (click)="onToggleCollapse()"
          class="btn btn-ghost btn-xs text-base-content/30 hover:text-base-content hover:bg-transparent"
          [attr.aria-label]="isCollapsed() ? 'Expand terminal' : 'Collapse terminal'"
          [attr.aria-expanded]="!isCollapsed()"
        >
          <lucide-icon
            [name]="isCollapsed() ? ChevronUpIcon : ChevronDownIcon"
            class="h-4 w-4"
          ></lucide-icon>
        </button>
      </div>
      @if (!isCollapsed()) {
      <div id="terminal-panel" class="card-body overflow-auto p-6" role="tabpanel">
        @if (activeTab() === 'test-cases') {
        <app-editor-output
          [expectedOutput]="expectedOutput()"
          (expectedOutputChange)="onExpectedOutputChange($event)"
        />
        } @else {
        <app-editor-results />
        }
      </div>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorPanelComponent {
  // Test cases icon.
  readonly TestCasesIcon = ClipboardList;
  // Terminal icon.
  readonly TerminalIcon = Terminal;
  // Chevron down icon.
  readonly ChevronDownIcon = ChevronDown;
  // Chevron up icon.
  readonly ChevronUpIcon = ChevronUp;
  // Whether the terminal section is collapsed.
  readonly isCollapsed = input.required<boolean>();
  // The expected output for the submission.
  readonly expectedOutput = input<string>('');
  // Emits when the expected output changes.
  readonly expectedOutputChange = output<string>();
  // The currently active tab.
  readonly activeTab = input<'test-cases' | 'result'>('test-cases');
  // Emits when the active tab changes.
  readonly activeTabChange = output<'test-cases' | 'result'>();
  // Emits when the collapse toggle is clicked.
  readonly toggleCollapse = output<void>();

  // Handles the collapse toggle click event.
  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  // Handles the active tab change event.
  onActiveTabChange(event: 'test-cases' | 'result'): void {
    this.activeTabChange.emit(event);
  }

  // Handles the expected output change event.
  onExpectedOutputChange(event: string): void {
    this.expectedOutputChange.emit(event);
  }
}
