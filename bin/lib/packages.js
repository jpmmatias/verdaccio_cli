#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackages = exports.createAndPublishPackages = exports.deletePackages = exports.publishPackages = exports.createPackages = void 0;
const utils_1 = require("./utils");
const prompts_1 = require("@clack/prompts");
const createPackages = async (bcs) => {
    try {
        prompts_1.log.message('Gerando pacotes...');
        const createdBcsPromises = bcs.map(bc => {
            const cliCommand = `yarn workspace ${bc} rollup`;
            return (0, utils_1.runCommand)(cliCommand, `Criado pacote ${bc} com sucesso`);
        });
        await Promise.allSettled(createdBcsPromises);
        prompts_1.log.success('Criado packages das bcs com sucesso');
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.createPackages = createPackages;
const publishPackages = async (bcs) => {
    try {
        prompts_1.log.message('Publicando packages no Verdaccio...');
        const publishingBcsPromises = bcs.map(bc => {
            const cliCommand = `export YARN_RC_FILENAME=local.yarnrc.yml && yarn workspace ${bc} publish`;
            return (0, utils_1.runCommand)(cliCommand, `Publicado BC ${bc} com sucesso`);
        });
        await Promise.allSettled(publishingBcsPromises);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.publishPackages = publishPackages;
const deletePackages = async (bcs) => {
    try {
        prompts_1.log.message('Deletando BCs...');
        const deletePromises = bcs.map(bc => {
            const cliCommand = `npm unpublish ${bc} --force`;
            return (0, utils_1.runCommand)(cliCommand, `Deletado ${bc} com sucesso`);
        });
        await Promise.allSettled(deletePromises);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.deletePackages = deletePackages;
const createAndPublishPackages = async (bcs) => {
    try {
        await (0, exports.createPackages)(bcs);
        await (0, exports.publishPackages)(bcs);
        return true;
    }
    catch (error) {
        prompts_1.log.error(error);
        return false;
    }
};
exports.createAndPublishPackages = createAndPublishPackages;
const updatePackages = async (bcs) => {
    try {
        await (0, exports.deletePackages)(bcs);
        await (0, exports.createAndPublishPackages)(bcs);
        return true;
    }
    catch (error) {
        prompts_1.log.error(error);
        return false;
    }
};
exports.updatePackages = updatePackages;
//# sourceMappingURL=packages.js.map