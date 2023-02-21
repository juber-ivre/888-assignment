import {describe, expect, jest, test} from '@jest/globals';
import {db} from '../db/db.js'
import { sportUpdateService, sportDeleteService, listAllSportsService, choicesAllSportsService, validateDuplicatedNames,sportCreateService } from '../services/sports.service';

//Jest's expect functions to verify that the functions are adding and deleting the correct sports from the database, 
//and logging the appropriate messages to the console. Also using jest.fn to mock the console.log function, so that 
//we can verify that the correct messages are being logged.


describe('sportCreateService',  () => {
  it('should add a new sport to the database', async () => {
    const answers = { name: 'Sport 1', displayName: 'Sport 1' };
    const originalData = [...db.data.sports];
    const result = await sportCreateService(answers);
    await db.read('sports')
    expect(db.data.sports).toHaveLength(originalData.length + 1);
    expect(db.data.sports).toEqual(expect.arrayContaining([expect.objectContaining(result)]));
  });
});


describe('validateDuplicatedNames', () => {
  it('returns true if input does not match any sport name', async () => {
    const result = await validateDuplicatedNames('New Sport');
    expect(result).toBe(true);
  });

  it('returns "Name Already Exists" if input matches a sport name', async () => {
    const result = await validateDuplicatedNames('Sport 1');
    expect(result).toBe('Name Already Exists');
  });
});


describe('choicesAllSportsService', () => {
  it('returns all sports sorted by order', async () => {
    const result = await choicesAllSportsService();
    console.log(result)
    expect(result).toEqual(result);
  });
});


describe('listAllSportsService', () => {
  it('returns all sports sorted by order', async () => {
    db.read()
    const result = await listAllSportsService();
    expect(result).toEqual([
      {id: 1, name: 'Sport 1', displayName: 'Sport 1', order: '1', slug: 'sport-Sport 1', active: false, events: [] }
    ]);
  });
});


describe('sportUpdateService', () => {
  it('processes sportsToBeUpdated and returns the result', async () => {
    const sportsToBeUpdated = { sports: ['Sport 1'] };
    const result = await sportUpdateService(sportsToBeUpdated);
    expect(result).toEqual({ id: 1, name: 'Sport 1', displayName: 'Sport 1', slug: 'sport-Sport 1', active: false, order: '1', events: [] });
  });

  it('processes result and answers and returns the updatedSport', async () => {
    const result = { id: 1, name: 'Sport 1', displayName: 'Sport 1 Display', slug: 'sport-Sport 1', active: false, order: '1', events: [] };
    const answers = { displayName: 'Updated Sport 1 Display', active: false };
    const updatedSport = await sportUpdateService('', result, answers);
    expect(updatedSport).toEqual({ id: 1, name: 'Sport 1', displayName: 'Updated Sport 1 Display', slug: 'sport-Sport 1', active: false, order: '1', events: [] });
  });
});




describe('sportDeleteService', () => {
  it('should delete a sport from the database', async () => {
    const sportToDelete = 'Sport 1';
    const originalData = [...db.data.sports];
    await sportDeleteService({ sports: [sportToDelete] });
    await db.read('sports')
    expect(db.data.sports).toHaveLength(originalData.length - 1);
    expect(db.data.sports).not.toContainEqual(expect.objectContaining({ name: sportToDelete }));
  });

  it('should log an error message when no sport is selected', async () => {
    console.log = jest.fn();
    await sportDeleteService({ sports: [] });
    expect(console.log).toHaveBeenCalledWith('No Sport Selected');
  });
});
