// yourModuleName.test.js

import {
  checkAndInstallPackages,
  checkNodeVersion,
} from '../src/lib/enviorement'

const mockAccessSync = jest.fn()
const mockExecSync = jest.fn()
const mockLogger = {
  message: jest.fn(),
  info: jest.fn(),
  success: jest.fn(),
  step: jest.fn(),
  warn: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
}
describe('checkNodeVersion', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return true if node version is valid', () => {
    const result = checkNodeVersion('20.9.0', mockExecSync, mockLogger)
    expect(result).toBe(true)
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(mockLogger.info).not.toHaveBeenCalled()
    expect(mockLogger.success).not.toHaveBeenCalled()
    expect(mockExecSync).not.toHaveBeenCalled()
  })

  it('should handle error when nvm is not found', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('nvm not found')
    })

    checkNodeVersion('v14.0.0', mockExecSync, mockLogger)

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Nvm não enconstrado. Por favor instale nvm e use a versão do node v14.0.0',
    )
  })
})

describe('checkAndInstallPackages', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should log success if node_modules exists', () => {
    mockAccessSync.mockImplementationOnce(() => {})

    checkAndInstallPackages(mockAccessSync, mockExecSync, mockLogger)

    expect(mockLogger.success).toHaveBeenCalledWith('node_modules existe')
    expect(mockLogger.info).not.toHaveBeenCalled()
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(mockExecSync).not.toHaveBeenCalled()
  })

  it('should handle error and log success when installing packages', () => {
    mockAccessSync.mockImplementationOnce(() => {
      throw new Error('node_modules not found')
    })

    mockExecSync.mockImplementationOnce(() => {})

    checkAndInstallPackages(mockAccessSync, mockExecSync, mockLogger)

    expect(mockLogger.info).toHaveBeenCalledWith(
      'node_modules não encontrado. Instalando...',
    )
    expect(mockExecSync).toHaveBeenCalledWith('yarn')
    expect(mockLogger.success).toHaveBeenCalledWith(
      'node_modules instalado com sucesso.',
    )
    expect(mockLogger.error).not.toHaveBeenCalled()
  })

  it('should handle error and log error if yarn installation fails', () => {
    mockAccessSync.mockImplementationOnce(() => {
      throw new Error('node_modules not found')
    })

    mockExecSync.mockImplementationOnce(() => {
      throw new Error('Yarn installation error')
    })

    checkAndInstallPackages(mockAccessSync, mockExecSync, mockLogger)

    expect(mockLogger.info).toHaveBeenCalledWith(
      'node_modules não encontrado. Instalando...',
    )
    expect(mockExecSync).toHaveBeenCalledWith('yarn')
    expect(mockLogger.success).not.toHaveBeenCalled()
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Erro instalando node_modules: Yarn installation error',
    )
  })
})
