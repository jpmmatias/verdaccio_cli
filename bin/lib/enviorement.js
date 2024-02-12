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
const checkNodeVersion = (node_version = constants_1.NODE_VERSION_REQUIRED, execSync = child_process_1.execSync, logger = prompts_1.log) => {
    const nodeVersion = process.version.slice(1);
    if (semver_1.default.satisfies(nodeVersion, node_version))
        return true;
    logger.error(`Verão do Node ${node_version} é requerida. Versão atual é ${nodeVersion}`);
    try {
        execSync('nvm --version', { stdio: 'ignore' });
        logger.info('NVM encontrado. Tentando trocar pra versão de node requerida...');
        try {
            execSync(`nvm install ${node_version} && nvm use ${node_version}`);
            logger.success(`Trocado para versão ${node_version} do Node com sucesso!`);
        }
        catch (nvmError) {
            logger.error(`Erro ao trocar versão do Node.js: ${nvmError.message}`);
            process.exit(1);
        }
    }
    catch (nvmNotFound) {
        logger.error(`Nvm não enconstrado. Por favor instale nvm e use a versão do node ${node_version}`);
    }
};
exports.checkNodeVersion = checkNodeVersion;
const checkAndInstallPackages = (checkAccessSync = fs_1.accessSync, executeSync = child_process_1.execSync, logger = prompts_1.log) => {
    try {
        checkAccessSync('node_modules', fs_1.constants.R_OK);
        logger.success('node_modules existe');
    }
    catch (error) {
        logger.info('node_modules não encontrado. Instalando...');
        try {
            executeSync('yarn');
            logger.success('node_modules instalado com sucesso.');
        }
        catch (installError) {
            logger.error(`Erro instalando node_modules: ${installError.message}`);
        }
    }
};
exports.checkAndInstallPackages = checkAndInstallPackages;
//# sourceMappingURL=enviorement.js.map