import { Component, input, model, output, signal, viewChild } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { EditorHeaderComponent } from './editor-header.component';
import { EditorDescriptionComponent } from './editor-description.component';
import { EditorCodeComponent } from './editor-code.component';
import { EditorTerminalComponent } from './editor-terminal.component';

const DEFAULT_MAIN_SIZES = [30, 70] as const;
const COLLAPSED_MAIN_SIZES = [4, 96] as const;
const DEFAULT_RIGHT_SIZES = [60, 40] as const;
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

  /** State for collapsing sections. */
  readonly isDescriptionCollapsed = signal(false);
  readonly isEditorCollapsed = signal(false);
  readonly isTerminalCollapsed = signal(false);

  /** Split sizes (percentages). */
  mainSplitSizes: number[] = [...DEFAULT_MAIN_SIZES];
  rightSplitSizes: number[] = [...DEFAULT_RIGHT_SIZES];

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
  handleSplitDragEnd(): void {
    this.codeEditor()?.layout();
  }

  /**
   * Toggles the description section visibility.
   */
  toggleDescription(): void {
    this.isDescriptionCollapsed.update((isCollapsed) => !isCollapsed);
    this.mainSplitSizes = this.isDescriptionCollapsed()
      ? [...COLLAPSED_MAIN_SIZES]
      : [...DEFAULT_MAIN_SIZES];
    this.handleSplitDragEnd();
  }

  /**
   * Toggles the editor section visibility.
   */
  toggleEditor(): void {
    this.isEditorCollapsed.update((isCollapsed) => !isCollapsed);
    this.rightSplitSizes = this.isEditorCollapsed()
      ? [...COLLAPSED_EDITOR_SIZES]
      : [...DEFAULT_RIGHT_SIZES];
    this.handleSplitDragEnd();
  }

  /**
   * Toggles the terminal section visibility.
   */
  toggleTerminal(): void {
    this.isTerminalCollapsed.update((isCollapsed) => !isCollapsed);
    this.rightSplitSizes = this.isTerminalCollapsed()
      ? [...COLLAPSED_TERMINAL_SIZES]
      : [...DEFAULT_RIGHT_SIZES];
    this.handleSplitDragEnd();
  }
}
