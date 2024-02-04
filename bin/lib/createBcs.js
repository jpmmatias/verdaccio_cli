#!/usr/bin/env node
import { log } from '@clack/prompts';
import { exec } from 'child_process';
import { exit } from 'process';
export const createBcs = async (bcs) => {
    log.message('Criando BCs...');
    const createdBcsPromisses = [];
    new Promise((resolve, reject) => {
        bcs.forEach(bc => {
            const cliCommand = `yarn workspace ${bc} rollup`;
            const createPromise = new Promise((innerResolve, innerReject) => {
                exec(cliCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error({ error: error.message });
                        log.error('Pacote ' + bc + ' não foi encontrado');
                        innerReject(error);
                        return;
                    }
                    if (stderr) {
                        log.error(stderr);
                        innerReject(stderr);
                        return;
                    }
                    innerResolve();
                });
            });
            createdBcsPromisses.push(createPromise);
        });
    });
    const boolean = Promise.allSettled(createdBcsPromisses).then(() => {
        log.success('Criado bcs com sucesso');
        return true;
    });
    return await boolean;
};
export const publishingBcs = async (bcs) => {
    log.message('Publicando BCs no Verdaccio...');
    const publishingBcsPromisses = [];
    new Promise((resolve, reject) => {
        bcs.forEach(bc => {
            const cliCommand = `export YARN_RC_FILENAME=local.yarnrc.yml && yarn workspace ${bc} publish`;
            const createPromise = new Promise((innerResolve, innerReject) => {
                exec(cliCommand, (error, stdout, stderr) => {
                    if (error) {
                        const responseCodeRegex = /Response Code: (\d+)/;
                        const match = stdout.match(responseCodeRegex);
                        const responseCode = match ? parseInt(match[1], 10) : null;
                        if (responseCode === 409) {
                            log.error(`Pacote ${bc} ja existe no Verdaccio, delete o pactote antes de criar novamente ou faça o update do package`);
                            exit();
                        }
                        innerReject(error);
                        exit();
                    }
                    if (stderr) {
                        innerReject(stderr);
                        exit();
                    }
                    log.success(`Publicado BC ${bc} com sucesso`);
                    innerResolve();
                });
            });
            publishingBcsPromisses.push(createPromise);
        });
    });
    const boolean = Promise.allSettled(publishingBcsPromisses).then(() => {
        return true;
    });
    return await boolean;
};
//# sourceMappingURL=createBcs.js.map