import { db } from '../db/db.js'
await db.read()

import { updateActiveStatusCommon, updateObjectWithId, allSports, allEvents, updateArrayItem, addObject, updateObjects } from './common.service.js'


// *** Create Event
export const eventCreateService = async (answers) => {
  const eventObject = await addObject(db.data.events, answers, 'events')
  const sportObject = db.data.sports.find(obj => obj.name === answers.sport)
  if (db.data.sports.length > 0) {

    await updateObjectWithId(sportObject, eventObject.id, 'events');

    await updateActiveStatusCommon(db.data.sports, [sportObject.id], 'events');
  }
  await updateObjects(db.data)

  await db.write()

  console.log('Event added successfully!');
  return [eventObject, sportObject]
}

// *** Delete Event
export const eventDeleteService = async (eventsToBeDeleted) => {
  if (eventsToBeDeleted.events.length === 0) {
    console.log('No Event Selected')
  } else {
    //returns and array of ids to be deleted from sports
    const idsToRemove = (db.data.events.filter(obj => eventsToBeDeleted.events.includes(obj.name)).map(obj => obj.id));
    db.data.events = db.data.events.filter(obj => !eventsToBeDeleted.events.includes(obj.name));
    // remove deleted ids from sports - one or more
    db.data.sports.forEach(sport => {
      sport.events = sport.events.filter(eventId => !idsToRemove.includes(eventId));
    });

    //update sport status based on deletion of event(s)
    await updateActiveStatusCommon(db.data.sports, '', 'events');
    await updateObjects(db.data)

    db.write()
    console.log('Deleted Successfully');
  }
}

// *** Search Event
export const eventSearchService = async (filters) => {
  const events = db.data.events.filter(event => {
    return event.name.match(new RegExp(filters.name, "i")) && event.active === true
  });

  console.log(events.slice(0, filters.activeEventsFilter))
  return events.slice(0, filters.activeEventsFilter)
}


// *** Update Event
export const eventUpdateService = async (eventsToBeUpdated, result, answers) => {
  const processEvents = async (eventsToBeUpdated) => {
    const result = db.data.events.find(object => object.name === eventsToBeUpdated.events[0])
    // console.log(db.data.events.find(object => object.name === eventsToBeUpdated.events[0]))
    return result
  }

  const processAnswers = async (result, answers) => {
    const updatedEvent = { ...result, ...answers }
    await updateArrayItem(db.data.events, updatedEvent.id, updatedEvent);

    const sportObject = db.data.sports.find(obj => obj.name === answers.sport)
    await updateObjectWithId(sportObject, result.id, 'events');

    const previousSport = db.data.sports.find(obj => obj.name === result.sport)
    // Looks for previous sport associated with this event ID and 
    if (previousSport.id !== sportObject.id) {
      const sportToUpdate = db.data.sports.find(sport => sport.id === previousSport.id);
      sportToUpdate.events = sportToUpdate.events.filter(event => event !== updatedEvent.id);
    }
    await updateActiveStatusCommon(db.data.sports, '', 'events');
    await updateObjects(db.data)

    db.write()
    return updatedEvent
  }
  if (eventsToBeUpdated) {

    console.log(Array.isArray(eventsToBeUpdated))
    return processEvents(eventsToBeUpdated)
  } else {
    return await processAnswers(result, answers)
  }
}

// *** Populate choices bt getting all Sports
export const choicesAllSportsService = async () => {

  if (db.data.sports.length > 0) {
    return allSports(db.data.sports)
  } else {
    return ['']
  }
}

// *** Populate choices bt getting all Events
export const choicesAllEventsService = async () => {
  return allEvents(db.data.events)

}


// *** List All Events
export const listAllEventsService = async () => {
  const events = db.data.events
  events.sort((a, b) => {
    return a.order - b.order;
  });
  console.log(events);
  return events
}

// *** Validate Duplicated Names
export const validateDuplicatedNames = async (input) => {
  return (db.data.events.some(event => event.name === input) ? 'Name Already Exists' : true)
}
