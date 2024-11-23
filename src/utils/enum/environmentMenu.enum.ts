/**
 * Enum que define os títulos das seções do menu de ambiente.
 * Utilizado para padronizar e centralizar os textos exibidos
 * nas diferentes seções do menu.
 *
 * @enum {string}
 */
export enum EnvironmentMenuTitles {
  /**
   * Seção inicial do menu de ambiente
   */
  BEGIN = 'Inicio',

  /**
   * Seção que contém os dados de cadastro do usuário
   */
  REGISTRATION_DATA = 'Dados Cadastrais',

  /**
   * Seção relacionada às configurações de segurança
   */
  SECURITY = 'Segurança',

  /**
   * Seção que lista todas as aulas disponíveis
   */
  CLASSES = 'Aulas',

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

  /**
   * Representa um estado desabilitado ou inativo do botão no menu.
   * Utilizado quando um item do menu deve estar presente mas não visível/interativo.
   */
  DISABLED = '',

  /**
   * Seção de aguardando voluntário
   */
  WAITING_VOLUNTEER = 'Aguardando voluntário',

  /**
   * Seção de aguardando sua confirmação
   */
  WAITING_YOUR_CONFIRMATION = 'Aguardando sua confirmação',

  /**
   * Seção de aulas agendadas
   */
  SCHEDULED_LESSONS = 'Aulas agendadas',

  /**
   * Representa um estado desabilitado ou inativo do botão no menu.
   * Utilizado quando um item do menu deve estar presente mas não visível/interativo.
   */
  NONE = '',
}
