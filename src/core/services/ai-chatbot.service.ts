import { fitdeskApi } from '../api/fitdeskApi';

export interface ChatMessage {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id?: string;
}

export interface RecommendationRequest {
  user_id: string;
}

export interface RecommendationResponse {
  rutina: string;
  frecuencia: string;
  objetivos: string;
  motivacion: string;
}

export class AIChatbotService {
  private static readonly BASE_URL = '/ai-chatbot';

  static async sendMessage(message: string, conversationId?: string): Promise<ChatResponse> {
    try {
      const { data } = await fitdeskApi.post<ChatResponse>(
        `${this.BASE_URL}/chat`,
        {
          message,
          conversation_id: conversationId,
        }
      );
      return data;
    } catch (error) {
      console.error('Error enviando mensaje al chatbot:', error);
      throw error;
    }
  }

  static async getRecommendation(userId: string): Promise<RecommendationResponse> {
    try {
      const { data } = await fitdeskApi.post<RecommendationResponse>(
        `${this.BASE_URL}/recommendation`,
        {
          user_id: userId,
        }
      );
      return data;
    } catch (error) {
      console.error('Error obteniendo recomendación:', error);
      throw error;
    }
  }

  static async getUserStats(userId: string): Promise<any> {
    try {
      const { data } = await fitdeskApi.get(`${this.BASE_URL}/stats/${userId}`);
      return data;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
}

