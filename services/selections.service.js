
import { db } from '../db/db.js'
await db.read()

import { updateArrayItem, allEvents, allMarkets, allSelections, updateActiveStatusCommon, addObject, updateObjectWithId, updateObjects } from './common.service.js'


// *** Create Selection
export const selectionCreateService = async (answers) => {
  const selectionObject = await addObject(db.data.selections, answers, 'selections')
  const marketObject = db.data.markets.find(obj => obj.name === answers.market)
  if(db.data.markets.length > 0){
  await updateObjectWithId(marketObject, selectionObject.id, 'selections')

  await updateActiveStatusCommon(db.data.markets, [marketObject.id], 'selections');
  }
  await updateObjects(db.data)

  db.write()

  console.log('Selecion added successfully!');
}

// *** Delete Market
export const selectionDeleteService = async (selectionsToBeDeleted) => {
  if (selectionsToBeDeleted.selection.length === 0) {
    console.log('No Event Selected')
  } else {
    //returns and array of ids to be deleted from sports
    const idsToRemove = (db.data.selections.filter(obj => selectionsToBeDeleted.selection.includes(obj.name)).map(obj => obj.id));
    db.data.selections = db.data.selections.filter(obj => !selectionsToBeDeleted.selection.includes(obj.name));

    // remove deleted ids from market - one or more
    db.data.markets.forEach(market => {
      market.selections = market.selections.filter(selectionId => !idsToRemove.includes(selectionId));
    });

    await updateActiveStatusCommon(db.data.markets, '', 'selections');
    await updateObjects(db.data)

    db.write()
    console.log('Deleted Successfully');

  }
}

// *** Search Selection
export const selectionSearchService = async (filters) => {
  const selections = db.data.selections.filter(selection => {
    return selection.name.match(new RegExp(filters.name, "i")) && selection.active === true
  });
  console.log(selections.slice(0, filters.activeSelectionsFilter))
  return selections.slice(0, filters.activeSelectionsFilter)
}


// *** Update Selection
export const selectionUpdateService = async (selectionsToBeUpdated, result, answers) => {

  const processSelections = async (selectionsToBeUpdated) => {
    const result = db.data.selections.find(object => object.name === selectionsToBeUpdated.selection[0])
    // console.log(db.data.selections.find(object => object.name === selectionsToBeUpdated.selection[0]))
    return result
  }

  const processAnswers = async (result, answers) => {
    const updatedSelection = { ...result, ...answers }
    await updateArrayItem(db.data.selections, updatedSelection.id, updatedSelection);

    const marketObject = db.data.markets.find(obj => obj.name === answers.market)
    await updateObjectWithId(marketObject, result.id, 'selections');

    const previousMarket = db.data.markets.find(obj => obj.name === result.market)
    // Looks for previous market associated with this selection ID and 
    if (previousMarket.id !== marketObject.id) {
      const marketToUpdate = db.data.markets.find(market => market.id === previousMarket.id);
      marketToUpdate.selections = marketToUpdate.selections.filter(selection => selection !== updatedSelection.id);
    }
    // await updateActiveStatus(db.data.markets)
    await updateActiveStatusCommon(db.data.markets, '', 'selections');
    await updateObjects(db.data)


    db.write()
    return updatedSelection
  }
  if (selectionsToBeUpdated) {
    return processSelections(selectionsToBeUpdated)
  } else {
    return await processAnswers(result, answers)
  }
}

// *** Populate choices by getting all Events
export const choicesAllEventsService = async () => {
  return allEvents(db.data.events)

}

// *** Populate choices by getting all Markets
export const choicesAllmarketsService = async () => {
  return allMarkets(db.data.markets)

}

// *** Populate choices by getting all Selections
export const choicesAllSelectionsService = async () => {
  return allSelections(db.data.selections)

}


// *** List All Selections
export const listAllSelectionsService = async () => {
  const selections = db.data.selections
  selections.sort((a, b) => {
    return a.order - b.order;
  });
  return console.log(selections);
}

// *** Validate Duplicated Names
export const validateDuplicatedNames = async (input) => {
  return (db.data.selections.some(selection => selection.name === input) ? 'Name Already Exists' : true)
}

