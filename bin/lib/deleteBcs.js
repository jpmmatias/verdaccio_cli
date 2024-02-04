#!/usr/bin/env node
import { log } from '@clack/prompts';
import { exec } from 'child_process';
export const deleteBcs = async (bcs) => {
    const deletePromises = [];
    new Promise((resolve, reject) => {
        log.message('Deletando BCs...');
        bcs.forEach(bc => {
            const cliCommand = `npm unpublish ${bc} --force`;
            const deletePromise = new Promise((innerResolve, innerReject) => {
                exec(cliCommand, (error, stdout, stderr) => {
                    if (error) {
                        log.error('Pacote ' + bc + ' não foi encontrado');
                        innerReject(error);
                        return;
                    }
                    log.success('Deletado ' + bc + ' com sucesso');
                    innerResolve();
                });
            });
            deletePromises.push(deletePromise);
        });
    });
    const boolean = Promise.allSettled(deletePromises).then(() => {
        return true;
    });
    return await boolean;
};
//# sourceMappingURL=deleteBcs.js.map