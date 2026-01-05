export const formatUsername = (username: string): string => {
    const parts = username.split(' ');
    switch (parts.length) {
        case 3:
            return `${parts[0]} ${parts[2]}`;
        case 4:
            return `${parts[0]} ${parts[3]}`;
        default:
            return username;
    }
};