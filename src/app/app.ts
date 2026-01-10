import { Component, inject, signal } from '@angular/core';
import { EditorComponent } from './components/codex-editor/codex-editor/editor.component';
import { CommonModule } from '@angular/common';
import { Judge0 } from './core/services/judge0';

@Component({
  selector: 'app-root',
  imports: [CommonModule, EditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
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

  // ngOnInit(): void {
    // this.judge0.getLanguages().subscribe((languages) => {
    //   console.log(languages);
    // });

    // this.judge0.createSubmission('console.log("Hello, World!");', '63', 'Hello, World!', 'Hello, World!').subscribe((submission) => {
    //   console.log(submission);
    // });

    // returned from judge0
    // {
    //   stdout: 'hello, Judge0\n',
    //   time: '0.007',
    //   memory: 856,
    //   stderr: null,
    //   token: 'f4614d72-46e3-4df4-ba3f-2ae235a4614b',
    //   compile_output: null,
    //   message: null,
    //   status: { id: 4, description: 'Wrong Answer' }
    // }
    // const submissionId = 'f4614d72-46e3-4df4-ba3f-2ae235a4614b';

    // this.judge0.getSubmission(submissionId).subscribe((submission) => {
    //   console.log(submission);
    // });
  // }
}
