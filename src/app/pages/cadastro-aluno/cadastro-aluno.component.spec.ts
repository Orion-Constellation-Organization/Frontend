import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAlunoComponent } from './cadastro-aluno.component';

describe('CadastroAlunoComponent', () => {
  let component: CadastroAlunoComponent;
  let fixture: ComponentFixture<CadastroAlunoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroAlunoComponent]
    });
    fixture = TestBed.createComponent(CadastroAlunoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
