import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroAlunoComponent } from './pages/cadastro-aluno/cadastro-aluno.component';

const routes: Routes = [
  {
    path: 'cadastro-aluno',
    component: CadastroAlunoComponent
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
