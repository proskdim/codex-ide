import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodexEditorComponent } from './editor.component';

describe('CodexEditorComponent', () => {
  let component: CodexEditorComponent;
  let fixture: ComponentFixture<CodexEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
