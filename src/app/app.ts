import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CodexEditorComponent } from '@codex-editor/codex-editor.component';
import { Judge0 } from './core/services/judge0';

@Component({
  selector: 'app-root',
  imports: [CodexEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly judge0 = inject(Judge0);

  readonly isEditorVisible = signal(true);

  /**
   * Toggles the visibility of the editor.
   */
  executeToggleEditor(): void {
    this.isEditorVisible.update((visible) => !visible);
  }
}
