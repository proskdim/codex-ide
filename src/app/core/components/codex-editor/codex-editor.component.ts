import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { EditorHeaderComponent } from '@codex-editor/editor-header.component';
import { EditorDescriptionComponent } from '@codex-editor/editor-description.component';
import { EditorCodeComponent } from '@codex-editor/editor-code.component';
import { EditorTerminalComponent } from '@codex-editor/editor-terminal.component';
import { Judge0Service } from '@app/core/services/judge/judge0';
import {
  Submission,
  SubmissionResult,
} from '@app/core/types/judge0.types';
import { finalize } from 'rxjs';
const DEFAULT_MAIN_SIZES = [45, 55] as const;
const DEFAULT_EDITOR_SIZES = [60, 40] as const;
const COLLAPSED_MAIN_SIZES = [4, 96] as const;
const COLLAPSED_EDITOR_SIZES = [6, 94] as const;
const COLLAPSED_TERMINAL_SIZES = [94, 6] as const;

interface SplitDragEvent {
  sizes: (number | '*')[];
}

const DEFAULT_DESCRIPTION = `
# Hello World


### Function declaration
\`\`\`typescript
function hello(): string {
  return "Hello, World!";
}
\`\`\`

### Function call
\`\`\`typescript
console.log(hello());
\`\`\`

### Expected output
Write a function that returns "Hello, World!".

### Example
**Output:** \`"Hello, World!"\`
`;

const DEFAULT_CODE = `function hello(): string {
  return "Hello, World!";
}

console.log(hello());`;

const DEFAULT_EXPECTED_OUTPUT = 'Hello, World!';

/**
 * CodexEditorComponent provides a split-pane interface with a markdown description,
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
  private readonly judge0 = inject(Judge0Service);

  // Emits when the editor should be closed.
  readonly editorClosed = output<void>();

  // Markdown big description content.
  readonly description = signal<string>(DEFAULT_DESCRIPTION);

  // Code content in the editor.
  readonly code = signal<string>(DEFAULT_CODE);

  // Judge0 language ID (TypeScript).
  readonly languageId = signal<number>(74);

  // Split sizes (percentages).
  readonly mainSplitSizes = signal<number[]>([...DEFAULT_MAIN_SIZES]);

  // Split sizes (percentages) for the right side.
  readonly rightSplitSizes = signal<number[]>([...DEFAULT_EDITOR_SIZES]);

  // Submission state.
  readonly isSubmitting = signal<boolean>(false);

  // result of the submission.
  readonly submissionResult = signal<SubmissionResult | null>(null);

  // The currently active tab in the terminal.
  readonly terminalTab = signal<'test-cases' | 'result'>('test-cases');

  // The expected output for the submission.
  readonly expectedOutput = signal<string>(DEFAULT_EXPECTED_OUTPUT);

  // State for collapsing sections, derived from split sizes.
  readonly isDescriptionCollapsed = computed(
    () => this.mainSplitSizes()[0] <= COLLAPSED_MAIN_SIZES[0] + 0.5
  );
  readonly isEditorCollapsed = computed(
    () => this.rightSplitSizes()[0] <= COLLAPSED_EDITOR_SIZES[0] + 0.5
  );
  readonly isTerminalCollapsed = computed(
    () => this.rightSplitSizes()[1] <= COLLAPSED_TERMINAL_SIZES[1] + 0.5
  );

  // Reference to the code editor component for layout updates.
  private readonly codeEditor = viewChild(EditorCodeComponent);

  // Monaco editor configuration options.
  readonly editorOptions = {
    language: 'typescript',
    tabSize: 2,
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true,
    fontFamily: 'JetBrains Mono, monospace',
    padding: { top: 15 },
    fixedOverflowWidgets: true,
  };

  // Submits the current code to Judge0 for execution.
  submitCode(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.submissionResult.set(null);
    this.terminalTab.set('result');

    if (this.isTerminalCollapsed()) {
      this.toggleTerminal();
    }

    const submissionData: Submission = {
      language_id: this.languageId(),
      source_code: this.code(),
      expected_output: this.expectedOutput(),
    };

    this.judge0
      .execute(submissionData)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (result) => {
          this.submissionResult.set(result);
        }
      });
  }

  // Emits when the editor should be closed.
  onEditorClosed(): void {
    this.editorClosed.emit();
  }

  // Emits when the active tab changes.
  onActiveTabChange(tab: 'test-cases' | 'result'): void {
    this.terminalTab.set(tab);
  }

  // Emits when the expected output changes.
  onExpectedOutputChange(output: string): void {
    this.expectedOutput.set(output);
  }

  // Emits when the code changes.
  onCodeChange(code: string): void {
    this.code.set(code);
  }

  // Handles the split drag event.
  handleSplitDrag(type: 'main' | 'right', event: SplitDragEvent): void {
    const { sizes } = event;
    const numericSizes = sizes.map((s) => (typeof s === 'number' ? s : 0));
    const target = type === 'main' ? this.mainSplitSizes : this.rightSplitSizes;
    target.set(numericSizes);
    this.codeEditor()?.layout();
  }

  // Toggles the description section visibility.
  toggleDescription(): void {
    this.mainSplitSizes.set(
      this.isDescriptionCollapsed() ? [...DEFAULT_MAIN_SIZES] : [...COLLAPSED_MAIN_SIZES]
    );
    this.codeEditor()?.layout();
  }

  // Toggles the editor section visibility.
  toggleEditor(): void {
    this.rightSplitSizes.set(
      this.isEditorCollapsed() ? [...DEFAULT_EDITOR_SIZES] : [...COLLAPSED_EDITOR_SIZES]
    );
    this.codeEditor()?.layout();
  }

  // Toggles the terminal section visibility.
  toggleTerminal(): void {
    this.rightSplitSizes.set(
      this.isTerminalCollapsed() ? [...DEFAULT_EDITOR_SIZES] : [...COLLAPSED_TERMINAL_SIZES]
    );
    this.codeEditor()?.layout();
  }
}
