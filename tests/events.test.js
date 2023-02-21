import {describe, expect, jest, test} from '@jest/globals';
import {eventCreateService, eventDeleteService, eventSearchService, eventUpdateService, choicesAllSportsService, validateDuplicatedNames , choicesAllEventsService, listAllEventsService} from '../services/events.service.js'
import { db } from '../db/db.js';

// const sports = {id: 1, name: 'Football', displayName: 'Sport 1', order: '1', slug: 'sport-Sport 1', active: false, events: [] }
// db.data.sports.push(sports)
// await db.write()

describe('eventCreateService', () => {
  beforeEach(() => {
    db.data = {sports: [], events: [],markets: [], selections: [] }
    const sports = {id: 1, name: 'Football', displayName: 'Sport 1', order: '1', slug: 'sport-Sport 1', active: false, events: [] }
    db.data.sports.push(sports)
    db.write()
  })

  const answers = {id: 1, name: 'EUA vs China', eventType: 'Preplay', sport: 'Football', status: 'Preplay'}
  it('should add a new event to the `events` array in the database', async () => {
    const originalData = [...db.data.events];
    await eventCreateService(answers);
    expect(db.data.events).toHaveLength(originalData.length + 1);
  });

  it('should update the events array of the relevant sport object in the database', async () => {
    const [eventObject, sportObject] = await eventCreateService(answers);
    const filteredData = db.data.sports.filter(sport => sport.id === sportObject.id);
    const events = filteredData.length > 0 ? filteredData[0].events : [];
    expect(events).toContain(eventObject.id);
  });

  it('should call db.write', async () => {
    const spy = jest.spyOn(db, 'write');
    await eventCreateService(answers);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});


describe('eventSearchService', () => {
  it('should return filtered events', async () => {
    const filters = { name: 'event', activeEventsFilter: 5 };
    const events = [
      { name: 'event1', active: true },
      { name: 'event2', active: true },
      { name: 'another event', active: true },
      { name: 'yet another event', active: false },
    ];
    db.data.events = events;
    
    const result = await eventSearchService(filters);
    expect(result).toEqual([
      { name: 'event1', active: true },
      { name: 'event2', active: true },
      { name: 'another event', active: true },
    ]);
  });
});


describe('listAllEventsService', () => {
  it('should return a sorted array of all events', async () => {
    const events = [
      { name: 'Event 1', order: 3 },
      { name: 'Event 2', order: 1 },
      { name: 'Event 3', order: 2 }
    ];
    db.data.events = events;
    const result = await listAllEventsService();
    expect(result).toEqual([
      { name: 'Event 2', order: 1 },
      { name: 'Event 3', order: 2 },
      { name: 'Event 1', order: 3 }
    ]);
  });
});

const eventsToBeDeleted = {
  events: ['Event 1', 'Event 2']
};

describe('eventDeleteService', () => {
  it('deletes events successfully', async () => {
    const spy = jest.spyOn(db, 'write');
    await eventDeleteService(eventsToBeDeleted);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
  
  it('logs a message if no events are selected', async () => {
    const eventsToBeDeleted = { events: [] };
    const spy = jest.spyOn(console, 'log');
    await eventDeleteService(eventsToBeDeleted);
    expect(spy).toHaveBeenCalledWith('No Event Selected');
    spy.mockRestore();
  });

  afterEach(async()=>{
    db.data = {sports: [], events:[], markets: [], selections:[]}
    db.write()
  })
});