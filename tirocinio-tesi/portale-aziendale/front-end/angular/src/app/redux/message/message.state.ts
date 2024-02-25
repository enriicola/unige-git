export type MessageSeverity = 'error' | 'warn' | 'info' | 'success';
export interface AppMessage {
    id: number;
    severity: MessageSeverity;
    message: string;
    hasBeenShown: boolean;
}
export interface MessagesState {
    current: AppMessage;
    messages: AppMessage[];
    limit: number;
}
export const initialMessagesState: MessagesState = {
    current: null,
    limit: 10,
    messages: []
};
