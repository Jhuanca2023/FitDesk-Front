import type { ChatMessage } from "@/core/interfaces/chat.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

interface MessageBubbleProps {
    message: ChatMessage;
    isCurrentUser: boolean;
    showAvatar: boolean;
    participant: { name: string; avatar?: string };
}

export const MessageBubble = ({ message, isCurrentUser, showAvatar, participant }: MessageBubbleProps) => {

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (isCurrentUser) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[70%] bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2">
                    <p className="break-words">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                        {formatTime(message.createdAt)}
                    </span>
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-[70%]">
                {showAvatar ? (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">
                            {getInitials(participant.name)}
                        </AvatarFallback>
                    </Avatar>
                ) : (
                    <div className="w-8" />
                )}

                <div className="bg-muted text-foreground rounded-2xl rounded-bl-md px-4 py-2">
                    <p className="break-words">{message.text}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                        {formatTime(message.createdAt)}
                    </span>
                </div>
            </div>
        </div>
    )
}
