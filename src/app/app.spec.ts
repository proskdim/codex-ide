import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideMarkdown } from 'ngx-markdown';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideMarkdown(),
        provideMonacoEditor(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Codex IDE');
  });

  it('should toggle editor visibility', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const initialVisible = app.isEditorVisible();
    app.executeToggleEditor();
    expect(app.isEditorVisible()).toBe(!initialVisible);
  });
});
