import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { MarkdownModule } from 'ngx-markdown';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'codex-editor',
  imports: [MonacoEditorModule, FormsModule, MarkdownModule, AngularSplitModule],
  templateUrl: './codex-editor.html',
  styleUrl: './codex-editor.css',
  standalone: true,
})
export class CodexEditor {
  showEditor = output();

  // monaco editor options
  editorOptions = { language: 'typescript', tabSize: 2, minimap: { enabled: false }, fontSize: 14 };
  // code example
  code: string = 'function x() {\n\tconsole.log("Hello world!");\n}';

  // description in markdown format
  description: string = '# Description\n\nThis is a description of the code example.';

  // visibility flags for panels
  isDescVisible = true;
  isEditorVisible = true;
  isTestVisible = true;

  // submit the code
  submitCode() {
    console.log(this.code);
  }

  onCloseEditor() {
    this.showEditor.emit();
  }

  togglePanel(panel: 'description' | 'editor' | 'test') {
    if (panel === 'description') {
      this.isDescVisible = !this.isDescVisible;
    } else if (panel === 'editor') {
      this.isEditorVisible = !this.isEditorVisible;
    } else if (panel === 'test') {
      this.isTestVisible = !this.isTestVisible;
    }
  }
}
