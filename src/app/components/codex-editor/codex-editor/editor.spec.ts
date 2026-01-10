import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorComponent } from './editor.component';
import { provideMarkdown } from 'ngx-markdown';
import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

describe('EditorComponent', () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorComponent],
      providers: [
        provideMarkdown(),
        provideMonacoEditor(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
