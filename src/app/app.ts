import { Component, signal } from '@angular/core';
import { CodexEditor } from './components/codex-editor/codex-editor/codex-editor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, CodexEditor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('codex-ide');

  showCodexEditor = signal(true);

  onShowCodexEditor() {
    this.showCodexEditor.set(!this.showCodexEditor());
  }
}
