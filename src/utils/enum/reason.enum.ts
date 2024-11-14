/**
 * Enum que representa os diferentes motivos para uma ação ou solicitação
 * @enum {string}
 */
export enum Reason {
  /** Indica que o motivo é para reforçar um conteúdo específico */
  REINFORCEMENT = 'reforço',

  /** Indica que o motivo está relacionado a uma prova ou trabalho específico */
  TEST = 'prova ou trabalho',

  /** Indica que o motivo é para correção de exercício */
  EXERCISE_CORRECTION = 'correção de exercício',

  /** Indica outros motivos não especificados nas opções anteriores */
  OTHER = 'outro',
}

/**
 * Objeto que mapeia os valores do enum Reason para seus textos de exibição
 */
export const ReasonLabel: Record<Reason, string> = {
  [Reason.REINFORCEMENT]: 'Reforço',
  [Reason.TEST]: 'Prova ou Trabalho',
  [Reason.EXERCISE_CORRECTION]: 'Correção de Exercício',
  [Reason.OTHER]: 'Outro',
};
