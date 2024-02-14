export declare const readFile: (filePath: string) => Promise<{
    type: "Buffer";
    data: number[];
}>;
type ChangeCodeOptions = {
    filePath: string;
    modification: string;
    replaceRegex: RegExp;
};
export declare const changeCode: ({ filePath, modification, replaceRegex, }: ChangeCodeOptions) => Promise<void>;
export declare const changeBcsInLegacyFiles: (bcs: any) => Promise<void>;
export declare const removePackageFromYarnLock: (bc: any) => Promise<void>;
export {};
