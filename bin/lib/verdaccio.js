#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromVerdaccio = exports.openVerdaccio = exports.installVerdaccio = void 0;
const prompts_1 = require("@clack/prompts");
const child_process_1 = require("child_process");
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
    try {
        prompts_1.log.info('Conectando com Verdaccio...');
        verdaccioProcess = (0, child_process_1.spawn)(cliCommand);
        verdaccioProcess.on('error', error => {
            prompts_1.log.error(`Error: ${error.message}`);
            throw error;
        });
        const data = await new Promise((resolve, reject) => {
            verdaccioProcess.stdout.on('data', () => {
                resolve(true);
            });
            prompts_1.log.success('Conectado com Verdaccio com sucesso!');
            prompts_1.log.step('');
        });
        verdaccioProcess.on('close', (code) => {
            if (code !== 0 && code) {
                prompts_1.log.error(`Processo do Verdaccio foi terminado com codigo ${code}`);
                throw new Error(`Verdaccio process exited with code ${code}`);
            }
        });
        return data;
    }
    catch (error) {
        prompts_1.log.error(`Error: ${error.message}`);
        throw error;
    }
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