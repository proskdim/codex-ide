import { Component, PLATFORM_ID, inject, input, model, output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

/**
 * Represents the Monaco editor instance layout method.
 */
interface MonacoEditor {
  layout(): void;
}

/**
 * Represents the Monaco editor configuration options.
 */
interface MonacoEditorOptions {
  language: string;
  tabSize: number;
  minimap: { enabled: boolean };
  fontSize: number;
  automaticLayout: boolean;
}

/**
 * Code editor component for the Codex Editor.
 * Wraps the Monaco editor and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-code',
  standalone: true,
  imports: [MonacoEditorModule, FormsModule],
  styles: `
    .hidden {
      display: none !important;
    }
  `,
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
        <span class="flex items-center gap-2 px-5 py-2 tracking-wide opacity-70">
          solution.ts
        </span>
        }
        <button
          (click)="toggleCollapse.emit()"
          class="btn btn-ghost btn-xs text-base-content/50"
          [title]="isCollapsed() ? 'Expand' : 'Collapse'"
        >
          <span class="text-lg">{{ isCollapsed() ? '↓' : '↑' }}</span>
        </button>
      </div>
      <div class="min-h-0 flex-1" [class.hidden]="isCollapsed()">
        @if (isBrowser) {
        <ngx-monaco-editor
          [options]="options()"
          [ngModel]="code()"
          (ngModelChange)="code.set($event)"
          (onInit)="handleEditorInit($event)"
          style="height: 100%"
        ></ngx-monaco-editor>
        }
      </div>
    </section>
  `,
})
export class EditorCodeComponent {
  /** Code content in the editor. */
  readonly code = model.required<string>();

  /** Whether the editor section is collapsed. */
  readonly isCollapsed = input.required<boolean>();

  /** Monaco editor configuration options. */
  readonly options = input.required<MonacoEditorOptions>();

  /** Emits when the collapse toggle is clicked. */
  readonly toggleCollapse = output<void>();

  /** Whether the component is running in a browser environment. */
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private editorInstance?: MonacoEditor;

  /**
   * Stores the editor instance.
   * @param editor The Monaco editor instance.
   */
  handleEditorInit(editor: MonacoEditor): void {
    this.editorInstance = editor;
  }

  /**
   * Triggers the editor layout update.
   */
  layout(): void {
    this.editorInstance?.layout();
  }
}
