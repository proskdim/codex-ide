import { Component, signal } from '@angular/core';
import { EditorComponent } from './components/codex-editor/codex-editor/editor.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, EditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly isEditorVisible = signal(true);

  onShowEditor(): void {
    this.isEditorVisible.update((visible) => !visible);
  }

  toggleEditor(): void {
    this.isEditorVisible.update((visible) => !visible);
  }
}
