const TimeMedianDataFeed = artifacts.require('TimeMedianDataFeed')
const { increaseTime, expectRevert, uintToBytes32 } = require('./helpers')

const now = (new Date()).getTime() / 1000;

const RESULT_1 = 1
const RESULT_2 = 2
const RESULT_3 = 3
const RESULT_4 = 4
const RESULT_5 = 5
const RESULT_6 = 6
const RESULT_7 = 7
const RESULT_8 = 8
const RESULT_9 = 9
const RESULT_10 = 10

const DATE_1 = now - 9 * 60 * 60 | 0
const DATE_2 = now - 8 * 60 * 60 | 0
const DATE_3 = now - 7 * 60 * 60 | 0
const DATE_4 = now - 6 * 60 * 60 | 0
const DATE_5 = now - 5 * 60 * 60 | 0
const DATE_6 = now - 4 * 60 * 60 | 0
const DATE_7 = now - 3 * 60 * 60 | 0
const DATE_8 = now - 2 * 60 * 60 | 0
const DATE_9 = now - 1 * 60 * 60 | 0
const DATE_10 = now | 0


const DATAFEEDS = new Map([
  [DATE_1, RESULT_5],
  [DATE_2, RESULT_4],
  [DATE_3, RESULT_3],
  [DATE_4, RESULT_2],
  [DATE_5, RESULT_1],
  [DATE_6, RESULT_6],
  [DATE_7, RESULT_7],
  [DATE_8, RESULT_8],
  [DATE_9, RESULT_9],
  [DATE_10, RESULT_10]
])

contract('TimeMedianDataFeed', (accounts) => {
  const dataSource = accounts[1]
  let dataFeed

  before(async ()=> {
    dataFeed = await TimeMedianDataFeed.new()
    await dataFeed.initialize(dataSource)

    for( var [key, value] of DATAFEEDS ){
      await dataFeed.setResult(uintToBytes32(value), key, { from: dataSource });
    }
  })

  describe('medianizeByTimeframe', () => {
    it('finds the correct median in an array of 10 (even)', async () => {
      let result = await dataFeed.medianizeByTimeframe.call(DATE_1, DATE_10)
      expect(result).to.equal(uintToBytes32(RESULT_6))
    })

    it('finds the correct median in an array of 5 (odd)', async () => {
      let result = await dataFeed.medianizeByTimeframe.call(DATE_3, DATE_7)
      expect(result).to.equal(uintToBytes32(RESULT_3))
    })

    it('finds the correct median when only one result lies within the timeframe', async () => {
      let result = await dataFeed.medianizeByTimeframe.call(DATE_7 + 60, DATE_8)
      expect(result).to.equal(uintToBytes32(RESULT_8))
    })

    it('finds the correct median when no results were recorded at or after endDate', async () => {
      let result = await dataFeed.medianizeByTimeframe.call(DATE_3, DATE_10 + 60 * 60 * 24 * 7)
      expect(result).to.equal(uintToBytes32(RESULT_7))
    })

    it('finds the correct median when no results were recorded at or before startDate', async () => {
      let result = await dataFeed.medianizeByTimeframe.call(DATE_1 - 60 * 60 * 24 * 7, DATE_5)
      expect(result).to.equal(uintToBytes32(RESULT_3))
    })

    it('finds the correct median when startDate is not exact', async () => {
      let result = await dataFeed.medianizeByTimeframe.call(DATE_1 + 60, DATE_8)
      expect(result).to.equal(uintToBytes32(RESULT_4))
    })

    it('finds the correct median when startDate is not exact', async () => {
      let result = await dataFeed.medianizeByTimeframe.call(DATE_1, DATE_8 + 60)
      expect(result).to.equal(uintToBytes32(RESULT_5))
    })

    it('finds the correct median when neither startDate nor endDate are exact', async () => {
      let result = await dataFeed.medianizeByTimeframe.call(DATE_2 + 60, DATE_8 + 60)
      expect(result).to.equal(uintToBytes32(RESULT_6))
    })

    it('reverts if startDate is after endDate', async () => {
      await expectRevert.unspecified(
        dataFeed.medianizeByTimeframe.call(DATE_2, DATE_1),
        'start date should be less than end date'
      )
    })

    it('reverts if all recorded dates are after endDate', async () => {
      await expectRevert.unspecified(
        dataFeed.medianizeByTimeframe.call(DATE_10 + 60, DATE_10 + 60 * 60),
        'end date should be included within dates range'
      )
    })

    it('reverts if all recorded dates are before startDate', async () => {
      await expectRevert.unspecified(
        dataFeed.medianizeByTimeframe.call(DATE_1 - 60 * 60, DATE_1 - 60),
        'start date not within  date range'
      )
    })
  })

  describe('medianizeByIndices', () => {
    it('finds the correct median for an odd array', async () => {
      let result = await dataFeed.medianizeByIndices.call(1, 5)
      expect(result).to.equal(uintToBytes32(RESULT_3))
    })

    it('finds the correct median for an even array', async () => {
      let result = await dataFeed.medianizeByIndices.call(2, 7)
      expect(result).to.equal(uintToBytes32(RESULT_4))
    })

    it('reverts startIndex is less than endIndex', async () => {
      await expectRevert.unspecified(
        dataFeed.medianizeByIndices.call(5, 3),
        'indices must be in order'
      )
    })
  })
})
