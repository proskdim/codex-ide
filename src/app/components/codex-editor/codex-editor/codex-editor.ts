import { Component, output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { MarkdownModule } from 'ngx-markdown';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'codex-editor',
  imports: [CommonModule, MonacoEditorModule, FormsModule, MarkdownModule, AngularSplitModule],
  templateUrl: './codex-editor.html',
  styleUrl: './codex-editor.css',
})
export class CodexEditor {
  showEditor = output();

  // State for collapsing sections
  isDescriptionCollapsed = signal(false);
  isEditorCollapsed = signal(false);
  isTerminalCollapsed = signal(false);

  // Split sizes (percentages)
  // Initial: Description 30%, Editor+Terminal 70%
  // Inside right: Editor 60%, Terminal 40%
  mainSplitSizes = [30, 70];
  rightSplitSizes = [60, 40];

  editorInstance: any;

  // monaco editor options
  editorOptions = {
    language: 'typescript',
    tabSize: 2,
    minimap: { enabled: false },
    fontSize: 14,
    automaticLayout: true // This helps with resizing
  };
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

  onEditorInit(editor: any) {
    this.editorInstance = editor;
  }

  onSplitDragEnd() {
    if (this.editorInstance) {
      this.editorInstance.layout();
    }
  }

  toggleDescription() {
    this.isDescriptionCollapsed.update(v => !v);
    if (this.isDescriptionCollapsed()) {
      this.mainSplitSizes = [4, 96];
    } else {
      this.mainSplitSizes = [30, 70];
    }
    this.onSplitDragEnd();
  }

  toggleEditor() {
    this.isEditorCollapsed.update(v => !v);
    if (this.isEditorCollapsed()) {
      this.rightSplitSizes = [6, 94];
    } else {
      this.rightSplitSizes = [60, 40];
    }
    this.onSplitDragEnd();
  }

  toggleTerminal() {
    this.isTerminalCollapsed.update(v => !v);
    if (this.isTerminalCollapsed()) {
      this.rightSplitSizes = [94, 6];
    } else {
      this.rightSplitSizes = [60, 40];
    }
    this.onSplitDragEnd();
  }
}
