import { ChatContainer } from "@/modules/shared/chat/components/chat-container";

export function MessagePage() {
    return (
        <div className="h-full">
            <ChatContainer userRole="TRAINER" />
        </div>
    );
}