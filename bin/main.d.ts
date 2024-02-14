interface CommandOption {
    command?: 'create' | 'update' | 'delete' | 'addLegacy';
    args: {
        Bc?: string[];
        Bcs?: string[];
        f?: string;
        filter?: string;
    };
}
export declare function main({ command, args }: CommandOption): Promise<void>;
export {};
