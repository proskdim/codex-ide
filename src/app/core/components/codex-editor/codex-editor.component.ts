import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { EditorHeaderComponent } from '@codex-editor/editor-header.component';
import { EditorDescriptionComponent } from '@codex-editor/editor-description.component';
import { EditorCodeComponent } from '@codex-editor/editor-code.component';
import { EditorTerminalComponent } from '@codex-editor/editor-terminal.component';
import { Judge0 } from '@app/core/services/judge0';
import { CreateSubmissionData } from '@app/core/models/judge0.model';

const DEFAULT_MAIN_SIZES = [45, 55] as const;
const DEFAULT_EDITOR_SIZES = [60, 40] as const;
const COLLAPSED_MAIN_SIZES = [4, 96] as const;
const COLLAPSED_EDITOR_SIZES = [6, 94] as const;
const COLLAPSED_TERMINAL_SIZES = [94, 6] as const;

const DEFAULT_DESCRIPTION = `
# Problem Statement

You are given a problem statement and a code editor.

# Code Editor

The code editor is a Monaco editor that allows you to write and edit code.

# Terminal

The terminal is a terminal that allows you to run code and see the output.

\`\`\`bash
$ npm install
$ npm run start
\`\`\`

# Example

Input: 1
Output: 1

Input: 2
Output: 2

Input: 3
\`\`\`typescript
function x() {
  console.log("Hello world!");
}
\`\`\`
`;

const DEFAULT_CODE = 'function x() {\n\tconsole.log("Hello world!");\n}';

/**
 * EditorComponent provides a split-pane interface with a markdown description,
 * a Monaco code editor, and a terminal/test cases area.
 */
@Component({
  selector: 'app-codex-editor',
  imports: [
    AngularSplitModule,
    EditorHeaderComponent,
    EditorDescriptionComponent,
    EditorCodeComponent,
    EditorTerminalComponent,
  ],
  templateUrl: './codex-editor.component.html',
  styleUrl: './codex-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodexEditorComponent {
  private readonly judge0 = inject(Judge0);

  /** Emits when the editor should be closed. */
  readonly showEditor = output<void>();

  /** Markdown big description content. */
  readonly description = input<string>(DEFAULT_DESCRIPTION);

  /** Code content in the editor. */
  readonly code = model<string>(DEFAULT_CODE);

  /** Split sizes (percentages). */
  readonly mainSplitSizes = signal<number[]>([...DEFAULT_MAIN_SIZES]);
  readonly rightSplitSizes = signal<number[]>([...DEFAULT_EDITOR_SIZES]);

  /** State for collapsing sections, derived from split sizes. */
  readonly isDescriptionCollapsed = computed(() => this.mainSplitSizes()[0] <= COLLAPSED_MAIN_SIZES[0] + 0.5);
  readonly isEditorCollapsed = computed(() => this.rightSplitSizes()[0] <= COLLAPSED_EDITOR_SIZES[0] + 0.5);
  readonly isTerminalCollapsed = computed(() => this.rightSplitSizes()[1] <= COLLAPSED_TERMINAL_SIZES[1] + 0.5);

  /** Reference to the code editor component for layout updates. */
  private readonly codeEditor = viewChild(EditorCodeComponent);

  /** Monaco editor configuration options. */
  readonly editorOptions = {
    language: 'typescript',
    tabSize: 2,
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true,
    fontFamily: 'JetBrains Mono, monospace',
  };

  /**
   * Submits the current code to Judge0 for execution.
   */
  executeSubmitCode(): void {
    const submissionData: CreateSubmissionData = {
      language_id: '63', // JavaScript
      source_code: btoa(this.code()),
    };

    this.judge0.createSubmission(submissionData).subscribe({
      next: (response) => {
        console.log('Submission created:', response.token);
        // TODO: Implement polling or wait for result if needed
      },
      error: (err) => {
        console.error('Failed to create submission:', err);
      },
    });
  }

  /**
   * Emits the close event.
   */
  executeCloseEditor(): void {
    this.showEditor.emit();
  }

  /**
   * Triggers the editor layout update when split panes are resized.
   * Synchronizes the split sizes signals in real-time.
   *
   * @param type The split area being resized ('main' or 'right').
   * @param event The drag event containing the new sizes.
   */
  handleSplitDrag(
    type: 'main' | 'right',
    { sizes }: { sizes: (number | '*')[] }
  ): void {
    const numericSizes = sizes.map((s) => (typeof s === 'number' ? s : 0));
    const target = type === 'main' ? this.mainSplitSizes : this.rightSplitSizes;
    target.set(numericSizes);
    this.codeEditor()?.layout();
  }

  /**
   * Toggles the description section visibility.
   */
  toggleDescription(): void {
    this.mainSplitSizes.set(
      this.isDescriptionCollapsed()
        ? [...DEFAULT_MAIN_SIZES]
        : [...COLLAPSED_MAIN_SIZES]
    );
    this.codeEditor()?.layout();
  }

  /**
   * Toggles the editor section visibility.
   */
  toggleEditor(): void {
    this.rightSplitSizes.set(
      this.isEditorCollapsed()
        ? [...DEFAULT_EDITOR_SIZES]
        : [...COLLAPSED_EDITOR_SIZES]
    );
    this.codeEditor()?.layout();
  }

  /**
   * Toggles the terminal section visibility.
   */
  toggleTerminal(): void {
    this.rightSplitSizes.set(
      this.isTerminalCollapsed()
        ? [...DEFAULT_EDITOR_SIZES]
        : [...COLLAPSED_TERMINAL_SIZES]
    );
    this.codeEditor()?.layout();
  }
}
