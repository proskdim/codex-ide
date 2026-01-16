import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { EditorNavComponent } from '@editor/parts/editor-nav.component';
import { EditorDescComponent } from '@editor/parts/editor-desc.component';
import { EditorCodeComponent } from '@app/core/components/editor/parts/editor-code.component';
import { EditorPanelComponent } from '@editor/parts/shell/editor-panel.component';
import { SubmissionService } from '@services/submission.service';
import { Judge0Request } from '@app/core/types/judge0.types';

const DEFAULT_MAIN_SIZES = [45, 55] as const;
const DEFAULT_EDITOR_SIZES = [60, 40] as const;
const COLLAPSED_MAIN_SIZES = [4, 96] as const;
const COLLAPSED_EDITOR_SIZES = [6, 94] as const;
const COLLAPSED_TERMINAL_SIZES = [94, 6] as const;

interface SplitDragEvent {
  sizes: (number | '*')[];
}

/**
 * EditorLayoutComponent provides a split-pane interface with a markdown description,
 * a Monaco code editor, and a terminal/test cases area.
 */
@Component({
  selector: 'app-editor',
  imports: [
    AngularSplitModule,
    EditorNavComponent,
    EditorDescComponent,
    EditorCodeComponent,
    EditorPanelComponent,
  ],
  template: `
    <div class="modal modal-open backdrop-blur-sm animate-in fade-in duration-300">
      <div
        class="modal-box relative flex h-full w-full max-w-[1500px] flex-col border border-base-300 bg-base-200 p-0 shadow-2xl animate-in zoom-in-95 duration-300 md:h-[95vh] md:w-[98vw] md:rounded-xl"
      >
        <!-- Header Navbar -->
        <app-editor-nav
          [isSubmitting]="isSubmitting()"
          (closeEditor)="onEditorClosed()"
          (runCode)="onRunCode()"
        />

        <!-- Main Content Area -->
        <main class="relative z-10 overflow-hidden flex-1 p-4">
          <as-split
            direction="horizontal"
            (dragEnd)="handleSplitDrag('main', $event)"
            [gutterSize]="10"
            class="rounded-xl"
          >
            <!-- Description Section -->
            <as-split-area [size]="mainSplitSizes()[0]" [minSize]="4">
              <app-editor-desc
                [content]="description()"
                [isCollapsed]="isDescriptionCollapsed()"
                (toggleCollapse)="toggleDescription()"
              />
            </as-split-area>

            <!-- Editor and Terminal Section -->
            <as-split-area [size]="mainSplitSizes()[1]">
              <as-split
                direction="vertical"
                (dragEnd)="handleSplitDrag('right', $event)"
                [gutterSize]="10"
              >
                <!-- Editor Section -->
                <as-split-area [size]="rightSplitSizes()[0]" [minSize]="6">
                  <app-editor-code
                    [(code)]="code"
                    [isCollapsed]="isEditorCollapsed()"
                    [language]="language()"
                    (toggleCollapse)="toggleEditor()"
                  />
                </as-split-area>

                <!-- Terminal / Test cases Section -->
                <as-split-area [size]="rightSplitSizes()[1]" [minSize]="6">
                  <app-editor-panel
                    [activeTab]="terminalTab()"
                    (activeTabChange)="onActiveTabChange($event)"
                    [(expectedOutput)]="expectedOutput"
                    [isCollapsed]="isTerminalCollapsed()"
                    (toggleCollapse)="toggleTerminal()"
                  />
                </as-split-area>
              </as-split>
            </as-split-area>
          </as-split>
        </main>
      </div>
    </div>
  `,
  styles: `
    :host {
  display: block;
  height: 100%;
}

/* Customizing angular-split gutters */
/* Note: ::ng-deep is used here as angular-split doesn't provide a better way to style gutters */
:host ::ng-deep .as-split-gutter {
  background-color: transparent !important;
  position: relative;
}

/* Horizontal split gutter (the vertical line) */
:host ::ng-deep as-split[direction='horizontal'] > .as-split-gutter::before {
  content: '';
  position: absolute;
  top: 12px;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background-color: transparent;
  transition: all 0.2s;
  border-radius: 4px;
}

:host ::ng-deep as-split[direction='horizontal'] > .as-split-gutter:hover::before {
  background-color: var(--color-base-300);
  width: 4px;
}

/* Vertical split gutter (the horizontal line) */
:host ::ng-deep as-split[direction='vertical'] > .as-split-gutter::before {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  background-color: transparent;
  transition: all 0.2s;
  border-radius: 4px;
}

:host ::ng-deep as-split[direction='vertical'] > .as-split-gutter:hover::before {
  background-color: var(--color-base-300);
  height: 4px;
}

/* Ensure the split component takes full height */
as-split {
  height: 100%;
  background-color: transparent;
}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  // Submission service.
  private readonly submissionService = inject(SubmissionService);
  // Submission state.
  readonly isSubmitting = this.submissionService.isSubmitting;
  // result of the submission.
  readonly submissionResult = this.submissionService.submissionResult;
  // Emits when the editor should be closed.
  readonly editorClosed = output<void>();
  // Markdown big description content.
  readonly description = input.required<string>();
  // Code content in the editor.
  readonly code = model.required<string>();
  // Language of the editor.
  readonly language = input.required<string>();
  // Judge0 language ID (TypeScript).
  readonly languageId = signal<number>(74);
  // Split sizes (percentages).
  readonly mainSplitSizes = signal<number[]>([...DEFAULT_MAIN_SIZES]);
  // Split sizes (percentages) for the right side.
  readonly rightSplitSizes = signal<number[]>([...DEFAULT_EDITOR_SIZES]);
  // The currently active tab in the terminal.
  readonly terminalTab = signal<'test-cases' | 'result'>('test-cases');
  // The expected output for the submission.
  readonly expectedOutput = model.required<string>();
  // State for collapsing sections, derived from split sizes.
  readonly isDescriptionCollapsed = computed(
    () => this.mainSplitSizes()[0] <= COLLAPSED_MAIN_SIZES[0]
  );
  // State for collapsing the editor section.
  readonly isEditorCollapsed = computed(
    () => this.rightSplitSizes()[0] <= COLLAPSED_EDITOR_SIZES[0]
  );
  // State for collapsing the terminal section.
  readonly isTerminalCollapsed = computed(
    () => this.rightSplitSizes()[1] <= COLLAPSED_TERMINAL_SIZES[1]
  );

  // Emits when the run code button is clicked.
  onRunCode(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.prepareUiForRun();
    this.submissionService.execute(this.createSubmissionData());
  }

  // Prepares the UI for the run.
  private prepareUiForRun(): void {
    this.terminalTab.set('result');

    if (this.isTerminalCollapsed()) {
      this.toggleTerminal();
    }
  }

  // Creates the submission data.
  private createSubmissionData(): Judge0Request {
    return {
      language_id: this.languageId(),
      source_code: this.code(),
      expected_output: this.expectedOutput(),
    };
  }

  // Emits when the editor should be closed.
  onEditorClosed(): void {
    this.editorClosed.emit();
  }

  // Emits when the active tab changes.
  onActiveTabChange(tab: 'test-cases' | 'result'): void {
    this.terminalTab.set(tab);
  }

  // Handles the split drag event.
  handleSplitDrag(type: 'main' | 'right', event: SplitDragEvent): void {
    const { sizes } = event;
    const numericSizes = sizes.map((s) => (typeof s === 'number' ? s : 0));
    const target = type === 'main' ? this.mainSplitSizes : this.rightSplitSizes;
    target.set(numericSizes);
  }

  // Toggles the description section visibility.
  toggleDescription(): void {
    this.mainSplitSizes.set(
      this.isDescriptionCollapsed() ? [...DEFAULT_MAIN_SIZES] : [...COLLAPSED_MAIN_SIZES]
    );
  }

  // Toggles the editor section visibility.
  toggleEditor(): void {
    this.rightSplitSizes.set(
      this.isEditorCollapsed() ? [...DEFAULT_EDITOR_SIZES] : [...COLLAPSED_EDITOR_SIZES]
    );
  }

  // Toggles the terminal section visibility.
  toggleTerminal(): void {
    this.rightSplitSizes.set(
      this.isTerminalCollapsed() ? [...DEFAULT_EDITOR_SIZES] : [...COLLAPSED_TERMINAL_SIZES]
    );
  }
}
