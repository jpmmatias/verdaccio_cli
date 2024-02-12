#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveAllBcOptions = void 0;
const prompts_1 = require("@clack/prompts");
const child_process_1 = require("child_process");
const process_1 = require("process");
const cliCommand = 'yarn workspaces list';
const transformString = (inputString) => {
    const regexMobile = /modules\/([^\/]+)\/mobile\/impl/;
    const regexMobileApi = /modules\/([^\/]+)\/mobile\/api/;
    const regexBusinessImpl = /modules\/([^\/]+)\/business\/impl/;
    const regexBusinessApi = /modules\/([^\/]+)\/business\/api/;
    switch (true) {
        case regexBusinessImpl.test(inputString):
            return inputString.replace(regexBusinessImpl, '@rd-bc-$1/business-impl');
        case regexBusinessApi.test(inputString):
            return inputString.replace(regexBusinessApi, '@rd-bc-$1/api');
        case regexMobile.test(inputString):
            return inputString.replace(regexMobile, '@rd-bc-$1/mobile-screens');
        case regexMobileApi.test(inputString):
            return inputString.replace(regexMobileApi, '@rd-bc-$1/mobile-api');
        default:
            return inputString;
    }
};
const isValidOption = (option) => option.startsWith('@rd-bc');
const retrieveOptions = (stdout, search) => {
    let optionsArr = stdout
        .split('\n')
        .map(option => option.replace('➤ YN0000:', ''))
        .map(option => transformString(option.trim()))
        .filter(option => isValidOption(option));
    if (search) {
        optionsArr = optionsArr.filter(item => item.includes(search));
    }
    if (optionsArr.length === 0) {
        prompts_1.log.error('Não foi achado nenhum package');
        if (search) {
            prompts_1.log.error('Tente usar o filtro com outro argumento');
        }
        (0, process_1.exit)();
    }
    return optionsArr;
};
const retrieveAllBcOptions = (search) => {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cliCommand, (error, stdout, stderr) => {
            if (error) {
                prompts_1.log.error(`Error: ${error.message}`);
                prompts_1.log.error('Erro: Possibilidade de workspaces do yarn nao estar configurado no caminho que esta chamando o verdaccio-cli, porfavor checar se esta no monorepo');
                return;
            }
            if (stderr) {
                console.error(`Error: ${stderr}`);
                reject(stderr);
                return;
            }
            const optionsArr = retrieveOptions(stdout, search);
            const mappedOptions = optionsArr.map(option => ({
                value: option,
                name: option,
            }));
            resolve(mappedOptions);
        });
    });
};
exports.retrieveAllBcOptions = retrieveAllBcOptions;
//# sourceMappingURL=retrievAllBcOptions.js.map