import {
  createPackages,
  publishPackages,
  deletePackages,
  createAndPublishPackages,
  updatePackages,
} from '../src/lib/packages'
import * as utils from '../src/lib/utils'
import { log } from '@clack/prompts'

jest.mock('../src/lib/utils', () => ({
  runCommand: jest.fn(),
}))

jest.mock('@clack/prompts', () => ({
  log: {
    message: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Package Functions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create packages successfully', async () => {
    jest.spyOn(utils, 'runCommand').mockResolvedValue(true)

    const result = await createPackages(['package-1', 'package-2'])

    expect(result).toBe(true)
    expect(log.message).toHaveBeenCalledWith('Gerando pacotes...')
    expect(log.success).toHaveBeenCalledWith(
      'Criado packages das bcs com sucesso',
    )
  })

  it('should publish packages successfully', async () => {
    jest.spyOn(utils, 'runCommand').mockResolvedValue(true)

    const result = await publishPackages(['package-1', 'package-2'])

    expect(result).toBe(true)
    expect(log.message).toHaveBeenCalledWith(
      'Publicando packages no Verdaccio...',
    )
  })

  it('should delete packages successfully', async () => {
    jest.spyOn(utils, 'runCommand').mockResolvedValue(true)

    const result = await deletePackages(['package-1', 'package-2'])

    expect(result).toBe(true)
    expect(log.message).toHaveBeenCalledWith('Deletando BCs...')
  })

  it('should create and publish packages successfully', async () => {
    jest.spyOn(utils, 'runCommand').mockResolvedValue(true)

    const result = await createAndPublishPackages(['package-1', 'package-2'])

    expect(result).toBe(true)
    expect(log.message).toHaveBeenCalledWith('Gerando pacotes...')
    expect(log.success).toHaveBeenCalledWith(
      'Criado packages das bcs com sucesso',
    )
    expect(log.message).toHaveBeenCalledWith(
      'Publicando packages no Verdaccio...',
    )
  })

  it('should update packages successfully', async () => {
    jest.spyOn(utils, 'runCommand').mockResolvedValue(true)

    const result = await updatePackages(['package-1', 'package-2'])

    expect(result).toBe(true)
    expect(log.message).toHaveBeenCalledWith('Deletando BCs...')
    expect(log.message).toHaveBeenCalledWith('Gerando pacotes...')
    expect(log.success).toHaveBeenCalledWith(
      'Criado packages das bcs com sucesso',
    )
    expect(log.message).toHaveBeenCalledWith(
      'Publicando packages no Verdaccio...',
    )
  })
})
