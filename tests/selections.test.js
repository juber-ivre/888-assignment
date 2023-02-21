import { describe, expect, jest, test } from '@jest/globals';
import {selectionCreateService, selectionDeleteService, selectionSearchService,selectionUpdateService} from '../services/selections.service.js'
import { db } from '../db/db.js';


describe("selectionCreateService", () => {
  test("it should add a selection successfully", async () => {
    const addObjectMock = jest.fn().mockReturnValue({ id: 3 });
    const updateObjectWithIdMock = jest.fn();
    const updateActiveStatusCommonMock = jest.fn();
    const updateObjectsMock = jest.fn();
    const db = {
      data: {
        selections: [
          {
            id: 1,
            name: "France",
            event: "Portugal vs France",
            market: "Half Time Results",
            price: "10.33",
            active: true,
            outcome: "Place",
            order: "1"
          },
          {
            id: 2,
            name: "Portugal",
            event: "Portugal vs France",
            market: "Half Time Results",
            price: "10.33",
            active: true,
            outcome: "Unsettled",
            order: "2"
          }
        ],
        markets: [
          {
            id: 1,
            name: "Half Time Results",
            selections: [1, 2]
          }
        ]
      },
      write: jest.fn()
    };
    const answers = {
      name: "Germany",
      event: "Portugal vs France",
      market: "Half Time Results",
      price: "10.33",
      active: true,
      outcome: "Place",
      order: "1"
    };

    await selectionCreateService(answers);

    expect(addObjectMock).toHaveBeenCalledWith(db.data.selections, answers, 'selections');
    expect(updateObjectWithIdMock).toHaveBeenCalledWith(
      {
        id: 1,
        name: "Half Time Results",
        selections: [1, 2]
      },
      3,
      'selections'
    );
    expect(updateActiveStatusCommonMock).toHaveBeenCalledWith(db.data.markets, [1], 'selections');
    expect(updateObjectsMock).toHaveBeenCalledWith(db.data);
    expect(db.write).toHaveBeenCalled();
  });
});


describe('selectionSearchService', () => {
  test('search for selections with name matching filters and active status', async () => {
    const filters = { name: 'France', activeSelectionsFilter: 1 };
    const selections = [
      {
        id: 1,
        name: 'France',
        event: 'Portugal vs France',
        market: 'Half Time Results',
        price: '10.33',
        active: true,
        outcome: 'Place',
        order: '1'
      },
      {
        id: 2,
        name: 'Portugal',
        event: 'Portugal vs France',
        market: 'Half Time Results',
        price: '10.33',
        active: true,
        outcome: 'Unsettled',
        order: '2'
      }
    ];
    const db = { data: { selections } };
    console.log = jest.fn();

    await selectionSearchService(filters);

    expect(console.log).toHaveBeenCalledWith([selections[0]]);
  });
});

//
describe('selectionUpdateService', () => {
  it('updates the selection successfully', async () => {
    const selectionsToBeUpdated = {
      selection: [
        {
          id: 1,
          name: "France",
          event: "Portugal vs France",
          market: "Half Time Results",
          price: "10.33",
          active: true,
          outcome: "Place",
          order: "1"
        }
      ]
    };

    const answers = {
      name: 'France',
      market: 'Full Time Results',
      price: '12.50'
    };

    const updatedSelection = await selectionUpdateService(selectionsToBeUpdated, undefined, answers);

    expect(updatedSelection).toEqual({
      id: 1,
      name: 'France',
      event: 'Portugal vs France',
      market: 'Full Time Results',
      price: '12.50',
      active: true,
      outcome: 'Place',
      order: '1'
    });
  });
});


//
describe('selectionDeleteService', () => {
  beforeEach(() => {
    db.data.selections = [
      { id: 1, name: 'Selection 1' },
      { id: 2, name: 'Selection 2' },
      { id: 3, name: 'Selection 3' }
    ];
    db.data.markets = [
      { id: 1, name: 'Market 1', selections: [1, 2] },
      { id: 2, name: 'Market 2', selections: [3] }
    ];
  });

  test('deletes selected selections', async () => {
    const selectionsToBeDeleted = { selection: ['Selection 1', 'Selection 3'] };
    await selectionDeleteService(selectionsToBeDeleted);
    expect(db.data.selections).toEqual([{ id: 2, name: 'Selection 2' }]);
    expect(db.data.markets).toEqual([{ id: 1, name: 'Market 1', selections: [2] }]);
  });

  test('does not delete anything if no selection is selected', async () => {
    const selectionsToBeDeleted = { selection: [] };
    await selectionDeleteService(selectionsToBeDeleted);
    expect(db.data.selections).toEqual([
      { id: 1, name: 'Selection 1' },
      { id: 2, name: 'Selection 2' },
      { id: 3, name: 'Selection 3' }
    ]);
    expect(db.data.markets).toEqual([
      { id: 1, name: 'Market 1', selections: [1, 2] },
      { id: 2, name: 'Market 2', selections: [3] }
    ]);
  });
});

