/**
 * Interface que define os dados do tutor necessários para o modal
 * Baseada na resposta da API de tutores
 */
export interface TutorModalData {
  id: number;
  username: string;
  birthDate: string; // formato: "YYYY-MM-DD"
  expertise: string;
  projectReason: string;
  chosenDate: string;
}
