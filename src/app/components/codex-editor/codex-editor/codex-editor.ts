import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'codex-editor',
  imports: [],
  templateUrl: './codex-editor.html',
  styleUrl: './codex-editor.css',
})

export class CodexEditor {
  showEditor = output();

  onCloseEditor() {
    this.showEditor.emit();
  }
}
