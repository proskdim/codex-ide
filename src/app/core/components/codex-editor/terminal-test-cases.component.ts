import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Component for displaying and managing test cases in the terminal.
 */
@Component({
  selector: 'app-terminal-test-cases',
  template: `
    <div class="flex h-full text-base-content/30">
      <p>Test cases content will be here.</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TerminalTestCasesComponent {}
