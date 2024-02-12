// Import necessary modules and functions for testing
import {
  installVerdaccio,
  openVerdaccio,
  disconnectFromVerdaccio,
} from '../src/lib/verdaccio'

// Mock the child_process module to simulate the behavior of execSync and spawn
jest.mock('child_process', () => ({
  execSync: jest.fn(),
  spawn: jest.fn(() => ({
    on: jest.fn(),
    kill: jest.fn(),
  })),
}))

// Mock the log module
jest.mock('@clack/prompts', () => ({
  log: {
    success: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}))

// Mock the process module
jest.mock('process', () => ({
  exit: jest.fn(),
}))

describe('installVerdaccio', () => {
  it('should log success if Verdaccio is already installed', () => {
    jest
      .spyOn(require('child_process'), 'execSync')
      .mockImplementationOnce(() => {})

    installVerdaccio()

    expect(require('@clack/prompts').log.success).toHaveBeenCalledWith(
      'Verdaccio instalado!' || 'Conectando com  Verdaccio...',
    )
  })

  it('should install Verdaccio and log success on successful installation', () => {
    jest
      .spyOn(require('child_process'), 'execSync')
      .mockImplementationOnce(() => {
        throw new Error('Command not found')
      })

    jest
      .spyOn(require('child_process'), 'execSync')
      .mockImplementationOnce(() => {})

    installVerdaccio()

    expect(require('@clack/prompts').log.info).toHaveBeenCalledWith(
      'Verdaccio não encontrado. Instalando...',
    )
    expect(require('@clack/prompts').log.success).toHaveBeenCalledWith(
      'Verdaccio instalado com sucesso.',
    )
  })
})

describe('openVerdaccio', () => {
  it('should log success on successful Verdaccio process execution', () => {
    openVerdaccio()

    expect(require('@clack/prompts').log.info).toHaveBeenCalledWith(
      'Conectando com  Verdaccio...',
    )
  })

  it('should log an error and exit on Verdaccio process error', () => {
    jest
      .spyOn(require('child_process'), 'spawn')
      .mockImplementationOnce(() => ({
        on: jest.fn((event, callback) => {
          if (event === 'error') {
            callback(new Error('Process error'))
          }
        }),
        kill: jest.fn(),
      }))

    openVerdaccio()

    expect(require('@clack/prompts').log.error).toHaveBeenCalledWith(
      'Error: Process error',
    )
    expect(require('process').exit).toHaveBeenCalled()
  })

  it('should log an error and exit on Verdaccio process close with non-zero code', () => {
    jest
      .spyOn(require('child_process'), 'spawn')
      .mockImplementationOnce(() => ({
        on: jest.fn((event, callback) => {
          if (event === 'close') {
            callback(1)
          }
        }),
        kill: jest.fn(),
      }))

    openVerdaccio()

    expect(require('@clack/prompts').log.error).toHaveBeenCalledWith(
      'Processo do Verdaccio foi terminado com codigo 1',
    )
    expect(require('process').exit).toHaveBeenCalled()
  })
})

describe('disconnectFromVerdaccio', () => {
  it('should log success and disconnect on successful disconnection', () => {
    const killMock = jest.fn()
    jest
      .spyOn(require('child_process'), 'spawn')
      .mockImplementationOnce(() => ({
        on: jest.fn(),
        kill: killMock,
      }))

    disconnectFromVerdaccio()

    expect(require('@clack/prompts').log.info).toHaveBeenCalledWith(
      'Disconectando do Verdaccio...',
    )
    expect(require('@clack/prompts').log.success).toHaveBeenCalledWith(
      'Disconectado!',
    )
  })

  it('should log a warning if verdaccioProcess is not found', () => {
    disconnectFromVerdaccio()

    expect(require('@clack/prompts').log.warn).toHaveBeenCalledWith(
      'Verdaccio não foi achado',
    )
  })
})
