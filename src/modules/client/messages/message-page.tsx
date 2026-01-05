import { ChatContainer } from "@/modules/shared/chat/components/chat-container";
export function ClientMessagePage() {
  return (
    <div className="h-full">
      <ChatContainer userRole="USER" />
    </div>
  );
}