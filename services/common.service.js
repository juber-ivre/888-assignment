
export async function updateActiveStatusCommon(objects, ids = [], key) {
  if (ids.length > 0) {
    ids.forEach(id => {
      const object = objects.find(s => s.id === id);
      if (!object) return;
      if (object[key].length === 0) {
        object.active = false;
      } else {
        object.active = true;
      }
    });
  } else {
    objects.forEach(object => {
      if (object[key].length === 0) {
        object.active = false;
      } else {
        object.active = true;
      }
    });
  }
}

// async function updateActiveStatusSports(sports, ids = []) {
//   updateActiveStatusCommon(sports, ids, 'events');
// }

// async function updateActiveStatusObjects(objects, ids = []) {
//   updateActiveStatusCommon(objects, ids, 'markets');
//   db.write();
// }


export const updateObjectWithId = (obj, id, key) => {
  let updateValues;
  if (obj[key] && !obj[key].includes(id)) {
    obj[key].push(id);
    updateValues = { ...obj };
  } else {
    updateValues = { ...obj, [key]: [id] };
  }
  return updateValues;
};

// const updatSportWithEvent = async (sport, eventId) => {
//   return updateObjectWithId(sport, eventId, 'events');
// };

// const updatEventWithMarket = async (event, marketId) => {
//   return updateObjectWithId(event, marketId, 'markets');
// };


// Functions to return sorted events and sports data
export const allSports = (sports)=> {
  if (!sports.length) return [];
  return sports.sort((a, b) => {
    return a.order - b.order;
  }).map(sport => sport.name);
}

export const allEvents = (events)=> {
  if (!events.length) return [];
  return events.sort((a, b) => {
    return a.order - b.order
  }).map(event => event.name)
};

export const allMarkets = (markets) => {
  if (!markets.length) return [];
  return markets.sort((a, b) => {
    return a.order - b.order;
  }).map(market => market.name);
}

export const allSelections = (selections) => {
  if (!selections.length) return [];
  return selections.sort((a, b) => {
    return a.order - b.order;
  }).map(selection => selection.name);
}


// export const addObject = (objects, answers, type) => {
//   let id = objects.length > 0 ? Math.max(...objects.map(obj => parseInt(obj.id))) : 0;
//   let maxOrder = objects.length > 0 ? Math.max(...objects.map(obj => parseInt(obj.order))) : 0;
//   const newObject = { id: (id + 1), ...answers, order: (maxOrder + 1).toString() };

//   if (type === 'event') {
//     newObject.markets = [];
//   } else if (type === 'market') {
//     newObject.selections = [];
//   } else if (type === 'sport') {
//     newObject.slug = `sport-${answers.name}`;
//     newObject.active = false;
//     newObject.events = [];
//   }

//   objects.push(newObject);
// };

//In this code, we loop through the update object and check if the value is not an empty string. 
//If it is not an empty string, we update the corresponding key in the newMarket object. After that, 
//we assign the updated newMarket object back to the original markets array.

export const updateArrayItem = (array, id, update) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      const newArrayItem = { ...array[i] };
      for (const key in update) {
        if (update[key] !== '') {
          newArrayItem[key] = update[key];
        }
      }
      array[i] = newArrayItem;
      return array;
    }
  }
  return array;
};

// const marketToBeUpdated = async (markets, id, update) => {
//   return updateArrayItem(markets, id, update);
// };

// const sportsToBeUpdated = async (sports, id, update) => {
//   return updateArrayItem(sports, id, update);
// };

export const addObject = async (objects, answers, type) => {
  let id = objects.length > 0 ? Math.max(...objects.map(object => parseInt(object.id))) : 0;
  let maxOrder = objects.length > 0 ? Math.max(...objects.map(object => parseInt(object.order))) : 0;
  const newObject = { id: (id + 1), ...answers, order: (maxOrder + 1).toString() }

  if (type === 'events') {
    newObject.slug = `event-${answers.name}`;
    newObject.markets = [];
  } else if (type === 'markets') {
    newObject.selections = [];
  } else if (type === 'sports') {
    newObject.slug = `sport-${answers.name}`;
    newObject.active = false;
    newObject.events = [];
  }
  objects.push(newObject);

  return newObject
};


export const updateObjects = async(data)=> {
  if(data.markets > 0){

    // update markets
    for (const market of data.markets) {
      if (market.selections.length === 0) {
        market.active = false;
      }
    }
  }

  if(data.events > 0){

  // update events
  for (const event of data.events) {
    let eventHasActiveMarket = false;
    for (const marketId of event.markets) {
      const market = data.markets.find(m => m.id === marketId);
      if (market.active) {
        eventHasActiveMarket = true;
        break;
      }
    }
    event.active = eventHasActiveMarket;
  }
}

if(data.sports > 0){

  // update sports
  for (const sport of data.sports) {
    let sportHasActiveEvent = false;
    for (const eventId of sport.events) {
      const event = data.events.find(e => e.id === eventId);
      if (event.active) {
        sportHasActiveEvent = true;
        break;
      }
    }
    sport.active = sportHasActiveEvent;
  }
}
}