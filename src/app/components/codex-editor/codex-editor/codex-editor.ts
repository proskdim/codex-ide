import { Component, Injectable, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'codex-editor',
  imports: [MonacoEditorModule, FormsModule, MarkdownModule],
  templateUrl: './codex-editor.html',
  styleUrl: './codex-editor.css',
})
export class CodexEditor {
  showEditor = output();

  // monaco editor options
  editorOptions = { language: 'typescript', tabSize: 2, minimap: { enabled: false }, fontSize: 14 };
  // code example
  code: string = 'function x() {\n\tconsole.log("Hello world!");\n}';

  // description in markdown format
  description: string = '# Description\n\nThis is a description of the code example.';

  // submit the code
  submitCode() {
    console.log(this.code);
  }

  onCloseEditor() {
    this.showEditor.emit();
  }
}
