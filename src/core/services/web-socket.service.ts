import type { ChatMessage, SendMessageData } from "../interfaces/chat.interface";

class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private currentRoomId: string | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectIntervalTime: number = 3000;
    private messageQueue: SendMessageData[] = [];

    private constructor() { }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect(roomId: string, onMessage: (message: ChatMessage) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.socket?.readyState === WebSocket.OPEN && this.currentRoomId === roomId) {
                resolve();
                return;
            }

            this.disconnect();
            this.currentRoomId = roomId;

            const wsUrl = `ws://localhost:9090/ws/chat/${roomId}`;
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log("🔗 WebSocket conectado a la sala:", roomId);
                this.reconnectAttempts = 0;
                this.processMessageQueue();
                resolve();
            };

            this.socket.onmessage = (event) => {
                try {
                    const message: ChatMessage = JSON.parse(event.data);
                    console.log("📨 Mensaje recibido:", message);
                    onMessage(message);
                } catch (error) {
                    console.error("Error al parsear mensaje:", error);
                }
            };

            this.socket.onerror = (error) => {
                console.error("❌ Error en WebSocket:", error);
                reject(error);
            };

            this.socket.onclose = (event) => {
                console.warn("🔌 WebSocket cerrado:", event.code, event.reason);

                if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.attemptReconnect(roomId, onMessage);
                }
            };
        });
    }

    private attemptReconnect(roomId: string, onMessage: (message: ChatMessage) => void) {
        this.reconnectAttempts++;
        console.log(`🔄 Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(() => {
            this.connect(roomId, onMessage).catch(() => {
                if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                    console.error("❌ Máximo de intentos de reconexión alcanzado");
                }
            });
        }, this.reconnectIntervalTime * this.reconnectAttempts);
    }

    sendMessage(message: SendMessageData): boolean {
        if (this.socket?.readyState === WebSocket.OPEN) {
            try {
                console.log("📤 Enviando mensaje:", message);
                this.socket.send(JSON.stringify(message));
                return true;
            } catch (error) {
                console.error("Error al enviar mensaje:", error);
                this.messageQueue.push(message);
                return false;
            }
        } else {
            console.warn("⚠️ WebSocket no disponible, mensaje agregado a la cola");
            this.messageQueue.push(message);
            return false;
        }
    }

    private processMessageQueue() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) {
                this.sendMessage(message);
            }
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close(1000, "Desconexión manual");
            this.socket = null;
        }
        this.currentRoomId = null;
        this.messageQueue = [];
    }

    isConnected(): boolean {
        return this.socket?.readyState === WebSocket.OPEN;
    }

    getConnectionState(): string {
        if (!this.socket) return 'DISCONNECTED';

        switch (this.socket.readyState) {
            case WebSocket.CONNECTING: return 'CONNECTING';
            case WebSocket.OPEN: return 'CONNECTED';
            case WebSocket.CLOSING: return 'CLOSING';
            case WebSocket.CLOSED: return 'DISCONNECTED';
            default: return 'UNKNOWN';
        }
    }
}

export const webSocketService = WebSocketService.getInstance();