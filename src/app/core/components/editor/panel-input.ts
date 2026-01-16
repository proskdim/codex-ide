import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Info } from 'lucide-angular';

/**
 * Component for displaying and managing test cases in the terminal.
 */
@Component({
  selector: 'app-panel-input',
  imports: [FormsModule, LucideAngularModule],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <span class="text-xs font-bold uppercase opacity-50">Expected Output</span>
        <div
          class="tooltip tooltip-right tooltip-primary"
          data-tip="The output your code is expected to produce"
        >
          <lucide-icon [name]="InfoIcon" class="h-4 w-4 opacity-30"></lucide-icon>
        </div>
      </div>
      <input
        type="text"
        class="input input-primary input-sm w-full font-mono text-sm shadow-lg"
        placeholder="Enter expected output to compare..."
        [ngModel]="expectedOutput()"
        (ngModelChange)="onModelChange($event)"
      />
      <div class="text-[10px] opacity-40 italic">
        * This will be compared against the actual output of your code.
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelInput {
  // Info icon.
  readonly InfoIcon = Info;
  // The expected output for the submission.
  readonly expectedOutput = model.required<string>();

  // Handles the model change event.
  onModelChange(event: string): void {
    this.expectedOutput.set(event);
  }
}
