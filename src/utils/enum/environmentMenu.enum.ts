/**
 * Enum que define os títulos das seções do menu de ambiente.
 * Utilizado para padronizar e centralizar os textos exibidos
 * nas diferentes seções do menu.
 *
 * @enum {string}
 */
export enum EnvironmentMenuTitles {
  /**
   * Seção de atividades agendadas
   */
  SCHEDULED = 'Agendadas',

  /**
   * Seção de solicitações de tutoria
   */
  TUTORING_REQUESTS = 'Pedidos de Tutoria',

  /**
   * Seção de atividades pendentes de confirmação do aluno
   */
  PENDING_STUDENT_CONFIRMATION = 'Aguardando confirmação do Aluno',
}
