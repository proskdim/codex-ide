import { Component, Injectable, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'codex-editor',
  imports: [MonacoEditorModule, FormsModule],
  templateUrl: './codex-editor.html',
  styleUrl: './codex-editor.css',
})

export class CodexEditor {
  showEditor = output();

  editorOptions = {language: 'typescript', tabSize: 2, minimap: {enabled: false}};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';

  onCloseEditor() {
    this.showEditor.emit();
  }
}
