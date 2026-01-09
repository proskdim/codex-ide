import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexEditor } from './codex-editor';

describe('CodexEditor', () => {
  let component: CodexEditor;
  let fixture: ComponentFixture<CodexEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodexEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
