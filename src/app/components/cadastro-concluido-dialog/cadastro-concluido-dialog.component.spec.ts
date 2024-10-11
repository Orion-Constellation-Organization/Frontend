import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroConcluidoDialogComponent } from './cadastro-concluido-dialog.component';

describe('CadastroConcluidoDialogComponent', () => {
  let component: CadastroConcluidoDialogComponent;
  let fixture: ComponentFixture<CadastroConcluidoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroConcluidoDialogComponent]
    });
    fixture = TestBed.createComponent(CadastroConcluidoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
