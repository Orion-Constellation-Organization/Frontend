import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/providers/auth.service';
import { EducationLevelService } from 'src/shared/providers/education-level.service';
import { UserType } from 'src/utils/enum/userType.enum';
import { StudentService } from 'src/shared/providers/student.service';
import { TutorService } from 'src/shared/providers/tutor.service';
import { formatDate } from '@angular/common';

/**
 * Componente responsável por exibir e gerenciar o perfil do usuário
 * @class ProfileComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  /** Nome do usuário a ser exibido no perfil */
  userName: string = '';

  /** Nível de educação do usuário */
  educationLevel: string = '';

  /** Data de nascimento do usuário */
  birthDate: string = '';

  /** Mensagem de erro */
  errorMessage: string | null = null;

  /**
   * Construtor do componente de perfil
   * @param {AuthService} authService - Serviço de autenticação
   * @param {EducationLevelService} educationLevelService - Serviço de níveis de educação
   * @param {HttpClient} http - Cliente HTTP para requisições
   */
  constructor(
    private authService: AuthService,
    private educationLevelService: EducationLevelService,
    private studentService: StudentService,
    private tutorService: TutorService
  ) {}

  /**
   * Método lifecycle do Angular executado na inicialização do componente
   * Carrega os dados do usuário
   */
  async ngOnInit() {
    await this.loadUserData();
  }

  /**
   * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
   * @param dateString Data a ser formatada
   * @returns String com a data formatada ou 'Não informada' se a data for inválida
   */
  private formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'Não informada';

    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Não informada';
    }
  }

  /**
   * Carrega os dados do perfil do usuário atual do sistema.
   *
   * Este método realiza as seguintes operações:
   * 1. Obtém os dados básicos do usuário através do AuthService
   * 2. Carrega os níveis de educação disponíveis
   * 3. Com base no tipo de usuário (STUDENT ou TUTOR):
   *    - Para estudantes: carrega dados específicos incluindo nível de educação individual
   *    - Para tutores: carrega dados específicos incluindo múltiplos níveis de educação
   *
   * @private
   * @async
   * @returns {Promise<void>}
   *
   * @throws {Error} Quando o ID do usuário não é encontrado no sistema
   *
   * @remarks
   * - Para estudantes, o nível de educação é uma string única
   * - Para tutores, o nível de educação pode ser uma lista concatenada de níveis
   * - Em caso de erro, os campos são preenchidos com valores padrão
   */
  private async loadUserData(): Promise<void> {
    try {
      this.errorMessage = null; // resetando a mensagem de erro
      const userData = await this.authService.getCurrentUser();

      if (!userData?.id) {
        throw new Error('ID do usuário não encontrado');
      }

      this.userName = userData.username || 'Usuário não encontrado';
      this.birthDate = this.formatDate(userData.birthDate);

      // primeiro obtenho os níveis de educação disponíveis
      const educationLevels =
        await this.educationLevelService.getEducationLevels();

      // depois, obtenho os dados do usuário
      // se o usuário é um estudante, obtenho o nível de educação individual
      if (userData.role === UserType.STUDENT) {
        const studentData = await this.studentService.getStudentById(
          userData.id
        );
        // se o usuário é um estudante, obtenho o nível de educação individual
        if (studentData?.educationLevel?.levelType) {
          this.educationLevel = studentData.educationLevel.levelType;
        } else {
          this.educationLevel = 'Não definido';
        }
        // se o usuário é um tutor, obtenho os níveis de educação múltiplos
      } else if (userData.role === UserType.TUTOR) {
        const tutorData = await this.tutorService.getTutorById(userData.id);
        // se o usuário é um tutor, obtenho os níveis de educação múltiplos
        if (tutorData?.educationLevelIds?.length) {
          const userLevels = educationLevels
            .filter((level) =>
              tutorData.educationLevelIds.includes(level.educationId)
            )
            .map((level) => level.levelType);
          this.educationLevel = userLevels.join(', ') || 'Não definido';
        }
      }
      // se ocorrer um erro, preencho os campos com valores padrão e a mensagem de erro
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      this.errorMessage = 'Erro ao carregar dados do usuário';
      this.userName = 'Usuário não encontrado';
      this.educationLevel = 'Não definido';
      this.birthDate = 'Não informada';
    }
  }
}
