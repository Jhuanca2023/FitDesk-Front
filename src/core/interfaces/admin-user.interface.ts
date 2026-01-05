export interface UserStatisticsAccount {
    totalUsers:     number;
    activeUsers:    number;
    inactiveUsers:  number;
    suspendedUsers: number;
    roleCounts:     RoleCounts;
}

export interface RoleCounts {
    ADMIN?: number;
    USER?:  number;
    TRAINER?: number;
}


export interface RolesWithDescription {
    roleName:    string;
    description: string;
}


export interface AccountProviders {
    googleUsers: number;
    totalUsers:  number;
    localUsers:  number;
}
