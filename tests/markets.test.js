
import { describe, expect, jest, test } from '@jest/globals';
import {
  marketCreateService, marketDeleteService, marketSearchService, marketUpdateService, choicesAllSportsService,
  validateDuplicatedNames, choicesAllEventsService, listAllMarketsService, choicesAllmarketsService
} from '../services/markets.service.js'

import {allMarkets} from '../services/common.service.js'
import { db } from '../db/db.js';

//
describe('marketCreateService', () => {
  beforeEach(() => {
    db.data.markets = [];
    db.data.events = [
      { id: '1', name: 'Event 1', markets: [] },
      { id: '2', name: 'Event 2', markets: [] }
    ];
  });

  it('should create a market', async () => {
    const answers = {
      name: 'Market 1',
      event: 'Event 1'
    };

    await marketCreateService(answers);

    expect(db.data.markets).toHaveLength(1);
    expect(db.data.markets[0]).toEqual({
      id: expect.any(Number),
      name: 'Market 1',
      event: 'Event 1',
      order: expect.any(String),
      selections: []
    });
    expect(db.data.events[0].markets).toHaveLength(1);
    expect(db.data.events[0].markets[0]).toEqual(expect.any(Number));
  });

  it('should update the active status of the associated event', async () => {
    const answers = {
      name: 'Market 1',
      event: 'Event 1'
    };

    await marketCreateService(answers);

    expect(db.data.events[0].active).toBe(true);
  });

  it('should write the changes to the database', async () => {
    const answers = {
      name: 'Market 1',
      event: 'Event 1'
    };

    const spy = jest.spyOn(db, 'write');
    await marketCreateService(answers);

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});


//
describe('marketSearchService', () => {
  it('should return the correct filtered markets based on the given filters', async () => {
    const filters = { name: 'Market', activeMarketsFilter: 5 };
    const mockMarkets = [
      { name: 'Market 1', active: true },
      { name: 'Market 2', active: false },
      { name: 'Market 3', active: true },
      { name: 'Market 4', active: true }
    ];
    db.data.markets = mockMarkets;
    const spy = jest.spyOn(console, 'log');
    await marketSearchService(filters);
    const expectedOutput = [
      { name: 'Market 1', active: true },
      { name: 'Market 3', active: true },
      { name: 'Market 4', active: true }
    ].slice(0, filters.activeMarketsFilter);
    expect(spy).toHaveBeenCalledWith(expectedOutput);
    spy.mockRestore();
  });
});



//
describe('Market Update Service', () => {
  let marketsToBeUpdated;
  let result;
  let answers;

  beforeEach(() => {
    marketsToBeUpdated = { market: ['Market 1'] };
    result = { id: 1, name: 'Market 1', event: 'Event 1', active: true };
    answers = { name: 'Market 1', event: 'Event 2', active: true };
    db.data = {
      markets: [
        { id: 1, name: 'Market 1', event: 'Event 1', active: true },
        { id: 2, name: 'Market 2', event: 'Event 1', active: true },
      ],
      events: [
        { id: 1, name: 'Event 1', markets: [1, 2], active: true },
        { id: 2, name: 'Event 2', markets: [], active: false },
      ],
    };
  });

  it('updates a market', async () => {
    const updatedMarket = await marketUpdateService('', result, answers);
    expect(updatedMarket).toEqual({ id: 1, name: 'Market 1', event: 'Event 2', active: true });
    expect(db.data.markets).toEqual([
      { id: 1, name: 'Market 1', event: 'Event 2', active: true },
      { id: 2, name: 'Market 2', event: 'Event 1', active: true },
    ]);
    expect(db.data.events).toEqual([
      { id: 1, name: 'Event 1', markets: [2], active: true },
      { id: 2, name: 'Event 2', markets: [1], active: true },
    ]);
  });

  it('handles market not found', async () => {
    marketsToBeUpdated = { market: ['Market 3'] };
    result = {};
    const updatedMarket = await marketUpdateService(marketsToBeUpdated);
    expect(updatedMarket).toEqual(undefined);
    expect(db.data.markets).toEqual([
      { id: 1, name: 'Market 1', event: 'Event 1', active: true },
      { id: 2, name: 'Market 2', event: 'Event 1', active: true },
    ]);
    expect(db.data.events).toEqual([
      { id: 1, name: 'Event 1', markets: [1, 2], active: true },
      { id: 2, name: 'Event 2', markets: [], active: false },
    ]);
  });
});

describe('marketDeleteService', () => {
  beforeEach(() => {
    // Reset the data in the database before each test
    db.data = {
      events: [
        {
          id: 0,
          name: 'Champions League Final',
          markets: [0, 1],
        },
        {
          id: 1,
          name: 'Euro Cup Final',
          markets: [2, 3],
        },
      ],
      markets: [
        { id: 0, name: 'Winner' },
        { id: 1, name: 'Top Scorer' },
        { id: 2, name: 'Winner' },
        { id: 3, name: 'Top Scorer' },
      ],
    };
  });

  it('should delete a market successfully', async () => {
    const marketsToBeDeleted = { market: ['Winner'] };
    await marketDeleteService(marketsToBeDeleted);

    expect(db.data.markets).toHaveLength(2);
    expect(db.data.markets[0]).toMatchObject({ id: 1, name: 'Top Scorer' });
    expect(db.data.markets[1]).toMatchObject({ id: 3, name: 'Top Scorer' });
    expect(db.data.events[0].markets).toHaveLength(1);
    expect(db.data.events[0].markets).toContain(1);
    expect(db.data.events[1].markets).toHaveLength(1);
    expect(db.data.events[1].markets).toContain(3);
  });

  it('should delete multiple markets successfully', async () => {
    const marketsToBeDeleted = { market: ['Winner', 'Top Scorer'] };
    await marketDeleteService(marketsToBeDeleted);

    expect(db.data.markets).toHaveLength(0);
    expect(db.data.events[0].markets).toHaveLength(0);
    expect(db.data.events[1].markets).toHaveLength(0);
  });

  it('should log "No Event Selected" if no market is selected', async () => {
    const marketsToBeDeleted = { market: [] };
    const consoleSpy = jest.spyOn(console, 'log');

    await marketDeleteService(marketsToBeDeleted);

    expect(consoleSpy).toHaveBeenCalledWith('No Event Selected');
  });
});

//
describe("choicesAllmarketsService", () => {
  test("it should return all markets", async () => {
    const db = {
      data: {
        markets: [
          { name: "Market 1" },
          { name: "Market 2" },
          { name: "Market 3" },
        ]
      }
    };

    // const allMarketsMock = jest.fn().mockReturnValue(["Market 1", "Market 2", "Market 3"]);
    // const allMarketsMock = jest.spyOn(db, 'data', 'value').mockReturnValue(["Market 1", "Market 2", "Market 3"]);
    const allMarketsMock = jest.fn().mockReturnValue(["Market 1", "Market 2", "Market 3"]);
    jest.spyOn(allMarkets, 'markets').mockImplementation(allMarketsMock);

    const result = await choicesAllmarketsService();
    expect(result).toEqual(["Market 1", "Market 2", "Market 3"]);
    expect(allMarketsMock).toHaveBeenCalled();
  });
});


// describe("choicesAllmarketsService", () => {
//   test("it should return all markets", async () => {
//     const db = {
//       data: {
//         markets: [
//           { name: "Market 1" },
//           { name: "Market 2" },
//           { name: "Market 3" },
//         ]
//       }
//     };

//     const allMarketsMock = jest.fn().mockReturnValue(["Market 1", "Market 2", "Market 3"]);
//     jest.spyOn(db, 'data', 'value').mockReturnValue({ markets: allMarketsMock });

//     const result = await choicesAllmarketsService();
//     expect(result).toEqual(["Market 1", "Market 2", "Market 3"]);
//     expect(allMarketsMock).toHaveBeenCalled();
//   });
// });




    describe('listAllMarketsService', () => {
      it('should sort and return a list of all markets', () => {
        const mockDb = {
          data: {
            markets: [
              { name: 'Market 1', order: 3 },
              { name: 'Market 2', order: 1 },
              { name: 'Market 3', order: 2 }
            ]
          }
        };

        global.db = mockDb;

        const result = listAllMarketsService();
        expect(result).toEqual([
          { name: 'Market 2', order: 1 },
          { name: 'Market 3', order: 2 },
          { name: 'Market 1', order: 3 }
        ]);
      });
    });


