/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search, Plus, User2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { fitdeskApi } from '@/core/api/fitdeskApi';
import { Image } from '../../../../shared/components/ui/image';
import { formatUsername } from '@/core/utils/chat-helpers';

interface UserListProps {
    targetRole: 'TRAINER' | 'USER';
    onSelectUser: (userId: string, userRole: 'TRAINER' | 'USER') => void;
    onBack: () => void;
}

interface User {
    id: string;
    username: string;
    enabled: boolean;
    avatar?: string;
    initials: string;

}


export function UserList({ targetRole, onSelectUser, onBack }: UserListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users', targetRole],
        queryFn: async (): Promise<User[]> => {
            const response = await fitdeskApi.get(`/chat/users/${targetRole}`);
            return response.data as User[];
        },
        staleTime: 60000,
    });

    return (
        <div className="flex flex-col h-full bg-card">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-xl font-semibold text-foreground">
                        Seleccionar {targetRole === 'TRAINER' ? 'Entrenador' : 'Usuario'}
                    </h1>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={`Buscar ${targetRole === 'TRAINER' ? 'entrenadores' : 'usuarios'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Lista de usuarios */}
            <div className="flex-1 overflow-y-auto p-2">
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <>
                            <div key={i} className="flex items-center gap-3 p-3">
                                <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                        <div className="text-4xl mb-4">
                            <User2 />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No se encontraron usuarios</h3>
                        <p className="text-center text-sm">
                            {searchTerm.trim()
                                ? `No hay resultados para "${searchTerm}"`
                                : `No hay ${targetRole === 'TRAINER' ? 'entrenadores' : 'usuarios'} disponibles`
                            }
                        </p>
                    </div>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            onClick={() => onSelectUser(user.id, targetRole)}
                            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50"
                        >
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {user.avatar ? <Image src={user.avatar} alt="Avatar" /> : user.initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <p className="font-medium text-foreground">
                                    {formatUsername(user.username)}
                                </p>

                            </div>

                            <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}