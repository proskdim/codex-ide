import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Editor } from '@app/core/components/editor/editor';
import { Judge0Service } from './core/services/judge/judge0';

@Component({
  selector: 'app-root',
  imports: [Editor],
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

  readonly editorLanguage = 'typescript';

  // Toggle editor visibility.
  onToggleEditor(): void {
    this.isEditorVisible.update((visible) => !visible);
  }
}
