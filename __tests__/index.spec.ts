// Mock the modules

import { createBcs, publishingBcs } from '../src/lib/createBcs'
import { deleteBcs } from '../src/lib/deleteBcs'
import { retrieveAllBcOptions } from '../src/lib/retrievAllBcOptions'
import { disconnectFromVerdaccio, openVerdaccio } from '../src/lib/verdaccio'
jest.mock('../src/lib/createBcs')
jest.mock('../src/lib/deleteBcs')
jest.mock('../src/lib/retrievAllBcOptions')
jest.mock('../src/lib/verdaccio')
describe('Test suite for Verdaccio CLI', () => {
  it('should create BCs', async () => {
    const bcs = ['bc1', 'bc2']
    retrieveAllBcOptions()
    await createBcs(bcs)
    expect(createBcs).toHaveBeenCalledWith(bcs)
  })

  it('should publish BCs', async () => {
    const bcs = ['bc1', 'bc2']
    retrieveAllBcOptions()
    await publishingBcs(bcs)
    expect(publishingBcs).toHaveBeenCalledWith(bcs)
  })

  it('should delete BCs', async () => {
    const bcs = ['bc1', 'bc2']
    retrieveAllBcOptions()
    await deleteBcs(bcs)
    expect(deleteBcs).toHaveBeenCalledWith(bcs)
  })
})
