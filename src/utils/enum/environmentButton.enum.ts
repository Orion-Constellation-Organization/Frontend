/**
 * Enum que define os tipos de botões disponíveis no ambiente da aplicação
 * @enum {string}
 */
export enum EnvironmentButton {
  /** Botão para criar um novo pedido de aula */
  PRIMARY = 'Novo Pedido de Aula',
  /** Botão com estilo secundário */
  SECONDARY = 'secondary',
  /** Botão com estilo fantasma (transparente) */
  GHOST = 'ghost',
  /** Botão para cancelar ações */
  CANCEL = 'Cancel',
  /** Botão para deletar itens */
  DELETE = 'Delete',
  /** Botão para salvar alterações */
  SAVE = 'Save',
  /** Botão para fechar modais ou seções */
  CLOSE = 'Close',
  /** Botão para enviar formulários */
  SUBMIT = 'Submit',
}
