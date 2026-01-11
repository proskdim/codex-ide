import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodexEditorComponent } from './codex-editor.component';
import { provideMarkdown } from 'ngx-markdown';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('CodexEditorComponent', () => {
  let component: CodexEditorComponent;
  let fixture: ComponentFixture<CodexEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexEditorComponent],
      providers: [
        provideMarkdown(),
        provideMonacoEditor(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle description', () => {
    const initialCollapsed = component.isDescriptionCollapsed();
    component.toggleDescription();
    expect(component.isDescriptionCollapsed()).toBe(!initialCollapsed);
  });

  it('should toggle editor', () => {
    const initialCollapsed = component.isEditorCollapsed();
    component.toggleEditor();
    expect(component.isEditorCollapsed()).toBe(!initialCollapsed);
  });

  it('should toggle terminal', () => {
    const initialCollapsed = component.isTerminalCollapsed();
    component.toggleTerminal();
    expect(component.isTerminalCollapsed()).toBe(!initialCollapsed);
  });

  it('should handle split drag', () => {
    const newSizes = [30, 70];
    component.handleSplitDrag('main', { sizes: newSizes });
    expect(component.mainSplitSizes()).toEqual(newSizes);
  });
});
