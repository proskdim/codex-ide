import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EditorComponent } from '@editor/editor.component';
import { Judge0Service } from './core/services/judge/judge0';

@Component({
  selector: 'app-root',
  imports: [EditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly judge0 = inject(Judge0Service);

  readonly isEditorVisible = signal(true);

  readonly editorExpectedOutput = 'Hello, World!';

  readonly editorDescription = `
  # Hello World
  ### Function declaration
  \`\`\`typescript
  function hello(): string {
    return "Hello, World!";
  }
  \`\`\`
  ### Function call
  \`\`\`typescript
  console.log(hello());
  \`\`\`
  `;

  readonly editorCode = `function hello(): string {
    return "Hello, World!";
  }
  
  console.log(hello());`;

  // Toggle editor visibility.
  onToggleEditor(): void {
    this.isEditorVisible.update((visible) => !visible);
  }
}
