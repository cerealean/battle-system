export interface ChangeEvent {
    Cancelled: boolean;
    PropogationStopped: boolean;
    Cancel(): void;
    StopPropogation(): void;
}
