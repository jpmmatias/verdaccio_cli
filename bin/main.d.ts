interface CommandOption {
    command?: 'create' | 'update' | 'delete';
    args: {
        Bc?: string[];
        Bcs?: string[];
        f?: string;
        filter?: string;
    };
}
export declare function main({ command, args }: CommandOption): Promise<void>;
export {};
