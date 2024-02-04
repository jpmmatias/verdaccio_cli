#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = void 0;
const prompts_1 = require("@clack/prompts");
const child_process_1 = require("child_process");
const process_1 = require("process");
const runCommand = async (cliCommand, successMessage) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cliCommand, (error, stdout, stderr) => {
            const isE404 = /npm ERR! 404/.test(stderr);
            if (isE404) {
                const bc = cliCommand
                    .replace('npm unpublish', '')
                    .replace('--force', '');
                prompts_1.log.warning(`Package ${bc} não encontrado no Verdaccio. Pode ser necessário verificar o nome do pacote ou a configuração do registro.`);
                reject(new Error('Package not found in the registry'));
                return;
            }
            const isPublishError = /export YARN_RC_FILENAME=local.yarnrc.yml && yarn workspace .* publish/.test(cliCommand) && stderr;
            if (isPublishError) {
                prompts_1.log.warning('Erro durante o comando de publicação. Talvez seja necessário verificar o nome do pacote ou se pacote ja existe no Verdaccio');
                reject(new Error('Erro durante o comando de publicação'));
                return;
            }
            if (error) {
                console.log(error);
                prompts_1.log.error(stderr || error.message);
                reject(error);
                (0, process_1.exit)();
            }
            prompts_1.log.success(successMessage);
            resolve(successMessage);
        });
    });
};
exports.runCommand = runCommand;
//# sourceMappingURL=utils.js.map