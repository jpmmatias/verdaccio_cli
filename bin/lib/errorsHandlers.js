#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommandError = void 0;
const handle404Error = (cliCommand) => {
    const bc = cliCommand.replace('npm unpublish', '').replace('--force', '');
    return `Package ${bc} não encontrado no Verdaccio. Pode ser necessário verificar o nome do pacote ou a configuração do registro.`;
};
const handlePublishError = () => {
    return 'Erro durante o comando de publicação. Talvez seja necessário verificar o nome do pacote ou se pacote já existe no Verdaccio';
};
const handleGenericError = (error, stderr) => {
    return stderr || error.message;
};
const handleCommandError = (error, stderr, cliCommand) => {
    if (/npm ERR! 404/.test(stderr || error.message))
        return handle404Error(cliCommand);
    if (/export YARN_RC_FILENAME=local.yarnrc.yml && yarn workspace .* publish/.test(cliCommand)) {
        return handlePublishError();
    }
    return handleGenericError(error, stderr);
};
exports.handleCommandError = handleCommandError;
//# sourceMappingURL=errorsHandlers.js.map