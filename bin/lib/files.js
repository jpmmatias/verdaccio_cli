"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePackageFromYarnLock = exports.changeBcsInLegacyFiles = exports.changeCode = exports.readFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const readFile = async (filePath) => {
    try {
        const data = await promises_1.default.readFile(filePath);
        console.log(data.toString());
        return data.toJSON();
    }
    catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
};
exports.readFile = readFile;
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
const changeCode = async ({ filePath, modification, replaceRegex, }) => {
    const npmrc = (await promises_1.default.readFile(filePath)).toString();
    const modified = npmrc.replace(replaceRegex, modification);
    await promises_1.default.writeFile(filePath, modified, 'utf-8');
};
exports.changeCode = changeCode;
const changeBcsInLegacyFiles = async (bcs) => {
    try {
        const yarnrcPath = '.yarnrc';
        let yarnrc = (await promises_1.default.readFile(yarnrcPath)).toString();
        console.log(bcs);
        bcs.forEach(bc => {
            const commonPrefix = getCommonPrefix(bc);
            const bcPattern = new RegExp(`("${commonPrefix}:registry" ".*?")`, 'g');
            const commentedBcPattern = new RegExp(`#\\s*("${escapeRegExp(commonPrefix)}:registry" ".*?")`, 'g');
            if (!yarnrc.match(commentedBcPattern)) {
                yarnrc = yarnrc.replace(bcPattern, '# $1');
            }
        });
        await promises_1.default.writeFile(yarnrcPath, yarnrc, 'utf-8');
        console.log('File updated successfully.');
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }
};
exports.changeBcsInLegacyFiles = changeBcsInLegacyFiles;
const getCommonPrefix = bc => {
    const parts = bc.split('/');
    return parts.length > 1 ? parts[0] : bc;
};
const removePackageFromYarnLock = async (bc) => {
    try {
        const yarnLockPath = 'yarn.lock';
        let yarnLock = (await promises_1.default.readFile(yarnLockPath)).toString();
        const bcPattern = new RegExp(`"@${escapeRegExp(bc)}\\d+\\.\\d+\\.\\d+":[^{]*\\{[^}]*\\}`, 'g');
        yarnLock = yarnLock.replace(bcPattern, '');
        await promises_1.default.writeFile(yarnLockPath, yarnLock, 'utf-8');
        console.log('yarn.lock file updated successfully.');
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }
};
exports.removePackageFromYarnLock = removePackageFromYarnLock;
//# sourceMappingURL=files.js.map