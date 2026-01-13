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
import { LucideAngularModule, Info, ArrowRight, ArrowLeft } from 'lucide-angular';
import ClipboardJS from 'clipboard';

/**
 * Description component for the Codex Editor.
 * Displays markdown content and handles collapse/expand.
 */
@Component({
  selector: 'app-editor-description',
  imports: [MarkdownModule, LucideAngularModule],
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
      class="card card-compact h-full overflow-hidden rounded-xl border border-base-300 bg-base-100 shadow-sm"
    >
      <div
        class="flex shrink-0 items-center border-b border-base-300 bg-base-200/50 text-sm font-bold"
        [class.justify-between]="!isCollapsed()"
        [class.justify-center]="isCollapsed()"
      >
        @if (!isCollapsed()) {
        <span class="flex items-center gap-2 px-5 py-2 tracking-wide opacity-50 uppercase text-[10px]">
          <lucide-icon [name]="InfoIcon" class="h-4 w-4"></lucide-icon>
          Problem Description
        </span>
        }
        <button
          (click)="onToggleCollapse()"
          class="btn btn-ghost btn-xs text-base-content/30 hover:text-base-content hover:bg-transparent"
          [class.mt-2]="isCollapsed()"
          [attr.aria-label]="isCollapsed() ? 'Expand description' : 'Collapse description'"
          [attr.aria-expanded]="!isCollapsed()"
        >
          <lucide-icon [name]="isCollapsed() ? ArrowRightIcon : ArrowLeftIcon" class="h-4 w-4"></lucide-icon>
        </button>
      </div>

      @if (!isCollapsed()) {
      <div class="card-body custom-scrollbar overflow-y-auto p-8 leading-relaxed">
        <markdown
          lineNumbers
          lineHighlight
          clipboard
          [data]="content()"
          class="prose prose-sm max-w-none prose-headings:border-b prose-headings:pb-2 prose-headings:mt-6 first:prose-headings:mt-0"
        />
      </div>
      }
    </section>
  `,
})
export class EditorDescriptionComponent {
  readonly InfoIcon = Info;
  readonly ArrowRightIcon = ArrowRight;
  readonly ArrowLeftIcon = ArrowLeft;

  // hack
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      (window as unknown as { ClipboardJS: typeof ClipboardJS }).ClipboardJS = ClipboardJS;
    }
  }

  // Markdown content to display.
  readonly content = input.required<string>();

  // Whether the description section is collapsed.
  readonly isCollapsed = input.required<boolean>();

  // Emits when the collapse toggle is clicked.
  readonly toggleCollapse = output<void>();

  onToggleCollapse(): void {
    this.toggleCollapse.emit();
  }
}
