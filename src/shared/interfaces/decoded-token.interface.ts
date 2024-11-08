/**
 * Interface que representa o token JWT decodificado
 * @interface DecodedToken
 * @property {number} id - ID do usuário
 * @property {string} email - Email do usuário
 * @property {string} role - Papel/função do usuário no sistema
 */
export interface DecodedToken {
  id: number;
  email: string;
  role: string;
}
