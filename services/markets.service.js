import { retry } from 'rxjs'
import { db } from '../db/db.js'
await db.read()

import { updateActiveStatusCommon, updateObjectWithId, allSports, allEvents, allMarkets, updateArrayItem, addObject, updateObjects } from './common.service.js'


// *** Create Market
export const marketCreateService = async (answers) => {
  const marketObject = await addObject(db.data.markets, answers, 'markets')
  const eventObject = db.data.events.find(obj => obj.name === answers.event)
  if(db.data.events.length > 0){

    await updateObjectWithId(eventObject, marketObject.id, 'markets');
    
    await updateActiveStatusCommon(db.data.events, [eventObject.id], 'markets');
  }
  await updateObjects(db.data)

  db.write()

  console.log('Market added successfully!');
}

// *** Delete Market
export const marketDeleteService = async (marketsToBeDeleted) => {
  if (marketsToBeDeleted.market.length === 0) {
    console.log('No Event Selected')
  } else {

    //returns and array of ids to be deleted from objects
    const idsToRemove = (db.data.markets.filter(obj => marketsToBeDeleted.market.includes(obj.name)).map(obj => obj.id));
    db.data.markets = db.data.markets.filter(obj => !marketsToBeDeleted.market.includes(obj.name));
    // remove deleted ids from objects - one or more
    db.data.events.forEach(event => {
      event.markets = event.markets.filter(marketId => !idsToRemove.includes(marketId));
    });

    //update sport status based on deletion of event(s)
    await updateActiveStatusCommon(db.data.events, '', 'markets');
    await updateObjects(db.data)


    db.write()
    console.log('Deleted Successfully');
  }
}

// *** Search Market
export const marketSearchService = async (filters) => {
  const markets = db.data.markets.filter(market => {
    return market.name.match(new RegExp(filters.name, "i")) && market.active === true
  });
  console.log(markets.slice(0, filters.activeMarketsFilter))
}


// *** Update Market
export const marketUpdateService = async (marketsToBeUpdated, result, answers) => {
 
  const processMarkets = async (marketsToBeUpdated) => {
    const result = db.data.markets.find(object => object.name === marketsToBeUpdated.market[0])
    if (!result) {
       console.log(`No market found with name "${marketsToBeUpdated.market[0]}"`)
       return result
    }
  
    console.log(result)
    //console.log(db.data.markets.find(object => object.name === marketsToBeUpdated.market[0]))
    return result
  }

  const processAnswers = async (result, answers) => {
    const updatedMarket = { ...result, ...answers }
    await updateArrayItem(db.data.markets, updatedMarket.id, updatedMarket);

    const eventObject = db.data.events.find(obj => obj.name === answers.event)
    await updateObjectWithId(eventObject, result.id, 'markets');

    const previousEvent = db.data.events.find(obj => obj.name === result.event)
    // Looks for previous event associated with this event ID and 
    if (previousEvent.id !== eventObject.id) {
      const eventToUpdate = db.data.events.find(event => event.id === previousEvent.id);
      eventToUpdate.markets = eventToUpdate.markets.filter(market => market !== updatedMarket.id);
    }
    //await updateActiveStatus(db.data.events)
    await updateActiveStatusCommon(db.data.events, '', 'markets');
    await updateObjects(db.data)


    db.write()
    return updatedMarket
  }
  if (marketsToBeUpdated) {
    return processMarkets(marketsToBeUpdated)
  } else {
    return await processAnswers(result, answers)
  }
}

// *** Populate choices by getting all Sports
export const choicesAllSportsService = async () => {
  return allSports(db.data.sports)
}

// *** Populate choices by getting all Events
export const choicesAllEventsService = async () => {
  return allEvents(db.data.events)

}

// *** Populate choices by getting all Markets
export const choicesAllmarketsService = async () => {
  const markets = allMarkets(db.data.markets)
  return markets

}


// *** List All Markets
export const listAllMarketsService = async () => {
  const markets = db.data.markets
  markets.sort((a, b) => {
    return a.order - b.order;
  });
  return console.log(markets);
}

// *** Validate Duplicated Names
export const validateDuplicatedNames = async (input) => {
  return (db.data.markets.some(market => market.name === input) ? 'Name Already Exists' : true)
}
