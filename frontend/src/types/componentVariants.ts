export const ProgressBarVariant = {
    Default: 'Default' as const,
    Compact: 'Compact' as const,
};

export type ProgressBarVariant = keyof typeof ProgressBarVariant;
