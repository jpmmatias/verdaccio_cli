"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndInstallPackages = exports.checkNodeVersion = void 0;
const child_process_1 = require("child_process");
const prompts_1 = require("@clack/prompts");
const fs_1 = require("fs");
const constants_1 = require("./constants");
const semver_1 = __importDefault(require("semver"));
const checkNodeVersion = () => {
    const nodeVersion = process.version.slice(1);
    if (!semver_1.default.satisfies(nodeVersion, constants_1.NODE_VERSION_REQUIRED)) {
        prompts_1.log.error(`Verão do Node ${constants_1.NODE_VERSION_REQUIRED} é requerida. Versão atual é ${nodeVersion}`);
        try {
            (0, child_process_1.execSync)('nvm --version', { stdio: 'ignore' });
            prompts_1.log.info('NVM encontrado. Tentando trocar pra versão de node requerida...');
            try {
                (0, child_process_1.execSync)(`nvm install ${constants_1.NODE_VERSION_REQUIRED} && nvm use ${constants_1.NODE_VERSION_REQUIRED}`);
                prompts_1.log.success(`Trocado para versão ${constants_1.NODE_VERSION_REQUIRED} do Node com sucesso!`);
            }
            catch (nvmError) {
                prompts_1.log.error(`Erro ao trocar versão do Node.js: ${nvmError.message}`);
                process.exit(1);
            }
        }
        catch (nvmNotFound) {
            prompts_1.log.error(`Nvm não enconstrado. Por favor instale nvm e use a versão do node ${constants_1.NODE_VERSION_REQUIRED}`);
            process.exit(1);
        }
    }
};
exports.checkNodeVersion = checkNodeVersion;
const checkAndInstallPackages = async () => {
    try {
        (0, fs_1.accessSync)('node_modules', fs_1.constants.R_OK);
        prompts_1.log.success('node_modules existe');
    }
    catch (error) {
        prompts_1.log.info('node_modules não encontrado. Instalando...');
        try {
            (0, child_process_1.execSync)('yarn');
            prompts_1.log.success('node_modules instalado com sucesso.');
        }
        catch (installError) {
            prompts_1.log.error(`Erro instalando node_modules: ${installError.message}`);
        }
    }
};
exports.checkAndInstallPackages = checkAndInstallPackages;
//# sourceMappingURL=enviorement.js.map