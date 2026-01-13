import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CodexEditorComponent } from '@codex-editor/codex-editor.component';
import { Judge0Service } from './core/services/judge/judge0';

@Component({
  selector: 'app-root',
  imports: [CodexEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly judge0 = inject(Judge0Service);

  readonly isEditorVisible = signal(true);

  /**
   * Toggles the visibility of the editor.
   */
  executeToggleEditor(): void {
    this.isEditorVisible.update((visible) => !visible);
  }
}
