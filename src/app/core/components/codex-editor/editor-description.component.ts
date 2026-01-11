import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import ClipboardJS from 'clipboard';

/**
 * Description component for the Codex Editor.
 * Displays markdown content and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-description',
  imports: [MarkdownModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: var(--color-base-300);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--color-base-content);
      opacity: 0.2;
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
          Description
        </span>
        }
        <button
          (click)="toggleCollapse.emit()"
          class="btn btn-ghost btn-xs text-base-content/50"
          [class.mt-2]="isCollapsed()"
          [title]="isCollapsed() ? 'Expand' : 'Collapse'"
        >
          <span class="text-lg">{{ isCollapsed() ? '→' : '←' }}</span>
        </button>
      </div>

      @if (!isCollapsed()) {
      <div class="card-body custom-scrollbar overflow-y-auto p-6 leading-relaxed">
        <markdown
          lineNumbers
          lineHighlight
          clipboard
          [data]="content()"
          class="prose prose-sm max-w-none"
        />
      </div>
      } @else {
      <div class="flex flex-1 items-center justify-center bg-base-200/30">
        <!-- Vertical text or just empty space -->
      </div>
      }
    </section>
  `,
})
export class EditorDescriptionComponent {
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      (window as unknown as { ClipboardJS: typeof ClipboardJS }).ClipboardJS = ClipboardJS;
    }
  }

  /** Markdown content to display. */
  readonly content = input.required<string>();

  /** Whether the description section is collapsed. */
  readonly isCollapsed = input.required<boolean>();

  /** Emits when the collapse toggle is clicked. */
  readonly toggleCollapse = output<void>();
}
