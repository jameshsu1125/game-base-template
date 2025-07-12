// Generic-file, every game code should have this file
export type EnumSchema<T extends string> = {
    values: readonly T[];
    default: T;
};
export type BooleanSchema = {
    values: readonly boolean[];
    default: boolean;
};

// Schema Types
export type NumericSchema = {
    min: number;
    max: number;
    default: number;
};

