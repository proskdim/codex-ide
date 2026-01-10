import { Component, computed, input, model, output, signal, viewChild } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { EditorHeaderComponent } from './editor-header.component';
import { EditorDescriptionComponent } from './editor-description.component';
import { EditorCodeComponent } from './editor-code.component';
import { EditorTerminalComponent } from './editor-terminal.component';

const DEFAULT_MAIN_SIZES = [45, 55] as const;
const DEFAULT_EDITOR_SIZES = [60, 40] as const;
const COLLAPSED_MAIN_SIZES = [4, 96] as const;
const COLLAPSED_EDITOR_SIZES = [6, 94] as const;
const COLLAPSED_TERMINAL_SIZES = [94, 6] as const;

/**
 * EditorComponent provides a split-pane interface with a markdown description,
 * a Monaco code editor, and a terminal/test cases area.
 */
@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    AngularSplitModule,
    EditorHeaderComponent,
    EditorDescriptionComponent,
    EditorCodeComponent,
    EditorTerminalComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css',
})
export class EditorComponent {
  /** Emits when the editor should be closed. */
  readonly showEditor = output<void>();

  /** Markdown big description content. */
  readonly description = input<string>(`
\`\`\`typescript
function x() {
  console.log("Hello world!");
}
\`\`\`
`);

  /** Code content in the editor. */
  readonly code = model<string>('function x() {\n\tconsole.log("Hello world!");\n}');

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
  };

  /**
   * Logs the current code to the console.
   */
  executeSubmitCode(): void {
    console.log(this.code());
  }

  /**
   * Emits the close event.
   */
  executeCloseEditor(): void {
    this.showEditor.emit();
  }

  /**
   * Triggers the editor layout update when split panes are resized.
   */
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
