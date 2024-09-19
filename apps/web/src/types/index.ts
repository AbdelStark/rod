export interface Transaction {
    id: number;
    amount: number;
    date: Date;
    description: string;
    status: "completed" | "pending" | "failed";
    recipient?: string;
    sender?: string;
    fee?: number;
}
export interface Contact {
    handle: string;
    avatarUrl: string;
}

export interface Notification {
    id: number;
    message: string;
    date: Date;
    read: boolean;
}
