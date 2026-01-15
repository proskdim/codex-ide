import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { LucideAngularModule, Code, ChevronDown, ChevronUp } from 'lucide-angular';

// Represents the Monaco editor instance layout method.
interface MonacoEditor {
  layout(): void;
}

// Represents the Monaco editor configuration options.
interface MonacoEditorOptions {
  language: string;
  tabSize: number;
  minimap: { enabled: boolean };
  fontSize: number;
  automaticLayout: boolean;
  fontFamily: string;
  padding?: { top?: number; bottom?: number };
  fixedOverflowWidgets?: boolean;
  hover?: {
    delay?: number;
    sticky?: boolean;
    above?: boolean;
  };
}

/**
 * Code editor component for the Codex Editor.
 * Wraps the Monaco editor and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-code',
  imports: [MonacoEditorModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="card card-compact h-full rounded-xl overflow-hidden border border-base-300 bg-base-100 shadow-sm flex flex-col"
    >
      <div
        class="flex shrink-0 items-center border-b border-base-300 bg-base-200/50 text-sm font-bold justify-between px-4 py-1"
      >
        <div class="flex items-center gap-3">
          <lucide-icon [name]="CodeIcon" class="h-4 w-4 opacity-40"></lucide-icon>
          <span class="flex items-center gap-2 py-1 tracking-wide opacity-50 font-mono text-xs">
            {{ fileName() }}
          </span>
        </div>
        <button
          (click)="onToggleCollapse()"
          class="btn btn-ghost btn-xs text-base-content/30 hover:text-base-content hover:bg-transparent"
          [attr.aria-label]="isCollapsed() ? 'Expand editor' : 'Collapse editor'"
          [attr.aria-expanded]="!isCollapsed()"
        >
          <lucide-icon
            [name]="isCollapsed() ? ChevronDownIcon : ChevronUpIcon"
            class="h-4 w-4"
          ></lucide-icon>
        </button>
      </div>
      <div class="min-h-0 flex-1">
        @if (isBrowser) {
        <ngx-monaco-editor
          [options]="options()"
          [ngModel]="code()"
          (ngModelChange)="onModelChange($event)"
          (onInit)="handleEditorInit($event)"
          style="height: 100%"
        ></ngx-monaco-editor>
        }
      </div>
    </section>
  `,
})
export class EditorCodeComponent {
  // Code icon.
  readonly CodeIcon = Code;
  // Chevron down icon.
  readonly ChevronDownIcon = ChevronDown;
  // Chevron up icon.
  readonly ChevronUpIcon = ChevronUp;
  // Code content in the editor.
  readonly code = model.required<string>();
  // File name to display.
  readonly fileName = input<string>('solution.ts');
  // Whether the editor section is collapsed.
  readonly isCollapsed = input.required<boolean>();
  // Monaco editor configuration options.
  readonly options = input.required<MonacoEditorOptions>();
  // Emits when the collapse toggle is clicked.
  readonly toggleCollapse = output<void>();
  // Whether the component is running in a browser environment.
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  // Stores the editor instance.
  private editorInstance?: MonacoEditor;

  // Handles the editor initialization.
  handleEditorInit(editor: MonacoEditor): void {
    this.editorInstance = editor;
  }

  // Handles the editor layout update.
  layout(): void {
    this.editorInstance?.layout();
  }

  // Handles the collapse toggle click event.
  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }

  // Handles the model change event.
  onModelChange(event: string): void {
    this.code.set(event);
  }
}
