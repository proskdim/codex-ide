import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, X, Play } from 'lucide-angular';

/**
 * Header component for the Codex Editor.
 * Provides actions for closing the editor and submitting code.
 */
@Component({
  selector: 'app-editor-nav',
  imports: [LucideAngularModule],
  template: `
    <nav
      class="navbar z-20 min-h-12 h-12 shrink-0 select-none rounded-t-xl border-b border-base-300 bg-base-100 px-4"
    >
      <div class="navbar-start gap-2">
        <button
          (click)="onCloseEditor()"
          aria-label="Close editor"
          class="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:bg-error hover:text-error-content"
        >
          <lucide-icon [name]="XIcon" class="h-4 w-4"></lucide-icon>
        </button>
      </div>

      <div class="navbar-center">
        <span id="editor-title" class="text-xs font-black tracking-[0.3em] opacity-20 uppercase"
          >Codex IDE</span
        >
      </div>

      <div class="navbar-end gap-2">
        <button
          (click)="onSubmitCode()"
          [disabled]="isSubmitting()"
          class="btn btn-primary btn-sm shadow-lg px-6 gap-2"
        >
          @if (isSubmitting()) {
          <span class="loading loading-spinner loading-xs"></span>
          } @else {
          <lucide-icon [name]="PlayIcon" class="h-3.5 w-3.5"></lucide-icon>
          } Run Code
        </button>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorNavComponent {
  // X Icon
  readonly XIcon = X;
  // Play Icon
  readonly PlayIcon = Play;
  // Whether the code is currently being submitted.
  readonly isSubmitting = input<boolean>(false);
  // Emits when the close button is clicked.
  readonly closeEditor = output<void>();
  // Emits when the submit button is clicked.
  readonly runCode = output<void>();

  // Handles the submit button click event.
  onSubmitCode(): void {
    this.runCode.emit();
  }

  // Handles the close button click event.
  onCloseEditor(): void {
    this.closeEditor.emit();
  }
}
