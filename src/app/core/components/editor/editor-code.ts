import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Code, ChevronDown, ChevronUp } from 'lucide-angular';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
/**
 * Code editor component for the Codex Editor.
 * Wraps the Monaco editor and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-code',
  imports: [FormsModule, LucideAngularModule, MonacoEditorModule],
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
        @if (isBrowser()) {
        <ngx-monaco-editor
          [options]="options()"
          [(ngModel)]="code"
          style="height: 100%;"
        ></ngx-monaco-editor>
        }
      </div>
    </section>
  `,
})
export class EditorCode {
  readonly isBrowser = signal(isPlatformBrowser(inject(PLATFORM_ID)));
  // Code icon.
  readonly CodeIcon = Code;
  // Chevron down icon.
  readonly ChevronDownIcon = ChevronDown;
  // Chevron up icon.
  readonly ChevronUpIcon = ChevronUp;
  // Code content in the editor.
  readonly code = model.required<string>();
  // Language of the editor.
  readonly language = input<string>('');
  // Whether the editor section is collapsed.
  readonly isCollapsed = input.required<boolean>();
  // Emits when the collapse toggle is clicked.
  readonly toggleCollapse = output<void>();

  // Monaco editor configuration options.
  readonly options = computed(() => ({
    language: this.language(),
    tabSize: 2,
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true,
    fontFamily: 'JetBrains Mono, monospace',
    padding: { top: 20 },
    fixedOverflowWidgets: true,
  }));

  // Handles the collapse toggle click event.
  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }
}
