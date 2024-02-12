#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromVerdaccio = exports.openVerdaccio = exports.installVerdaccio = void 0;
const prompts_1 = require("@clack/prompts");
const child_process_1 = require("child_process");
const process_1 = require("process");
const cliCommand = 'verdaccio';
let verdaccioProcess;
const installVerdaccio = async () => {
    try {
        (0, child_process_1.execSync)('which verdaccio');
        prompts_1.log.success('Verdaccio instalado!');
    }
    catch (error) {
        prompts_1.log.info('Verdaccio não encontrado. Instalando...');
        try {
            (0, child_process_1.execSync)('pnpm install -g verdaccio');
            prompts_1.log.success('Verdaccio instalado com sucesso.');
        }
        catch (installError) {
            prompts_1.log.error(`Erro ao instalar Verdaccio: ${installError.message}`);
        }
    }
};
exports.installVerdaccio = installVerdaccio;
const openVerdaccio = async () => {
    prompts_1.log.info('Conectando com  Verdaccio...');
    verdaccioProcess = (0, child_process_1.spawn)(cliCommand);
    verdaccioProcess.on('error', error => {
        prompts_1.log.error(`Error: ${error.message}`);
        (0, process_1.exit)();
    });
    verdaccioProcess.on('close', code => {
        if (code !== 0) {
            prompts_1.log.error(`Processo do Verdaccio foi terminado com codigo ${code}`);
            (0, process_1.exit)();
        }
        prompts_1.log.success('Conectado!');
    });
};
exports.openVerdaccio = openVerdaccio;
const disconnectFromVerdaccio = () => {
    if (verdaccioProcess) {
        prompts_1.log.info('Disconectando do Verdaccio...');
        verdaccioProcess.kill();
        verdaccioProcess = null;
        prompts_1.log.success('Disconectado!');
    }
    else {
        prompts_1.log.warn('Verdaccio não foi achado');
    }
};
exports.disconnectFromVerdaccio = disconnectFromVerdaccio;
//# sourceMappingURL=verdaccio.js.map