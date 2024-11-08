/**
 * Enum que representa os diferentes motivos para uma ação ou solicitação
 * @enum {string}
 */
export enum Reason {
  /** Indica que o motivo é para reforçar um conteúdo específico */
  REINFORCEMENT = 'Reforço do conteúdo',

  /** Indica que o motivo está relacionado a uma prova ou trabalho específico */
  TEST = 'Prova ou trabalho específico',

  /** Indica que o motivo é para correção de exercício */
  EXERCISE_CORRECTION = 'Correção de exercício',

  /** Indica outros motivos não especificados nas opções anteriores */
  OTHER = 'Outro',
}
