import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * Header component for the Codex Editor.
 * Provides actions for closing the editor and submitting code.
 */
@Component({
  selector: 'app-editor-header',
  template: `
    <nav
      class="navbar z-20 min-h-10 h-10 shrink-0 select-none border-b border-base-300 bg-base-100 px-3"
    >
      <div class="navbar-start">
        <button
          (click)="closeEditor.emit()"
          aria-label="Close editor"
          class="btn btn-ghost btn-xs text-base-content/50 hover:bg-error hover:text-error-content"
        >
          <span class="text-sm">✕</span>
        </button>
      </div>

      <div class="navbar-center">
        <span
          id="editor-title"
          class="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase"
          >Codex Editor</span
        >
      </div>

      <div class="navbar-end">
        <button
          (click)="submitCode.emit()"
          class="btn btn-success btn-xs px-4 font-bold shadow-sm"
        >
          Submit
        </button>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorHeaderComponent {
  /** Emits when the close button is clicked. */
  readonly closeEditor = output<void>();

  /** Emits when the submit button is clicked. */
  readonly submitCode = output<void>();
}
