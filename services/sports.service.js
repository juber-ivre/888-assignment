import {db} from '../db/db.js'
await db.read()

import { allSports, updateArrayItem, addObject,updateObjects } from './common.service.js'

db.write()
export const sportCreateService = async(answers)=>{
  //await updateObjects()
   const result = await addObject(db.data.sports, answers, 'sports')
await updateObjects(db.data)

  db.write()
  return result
}

export const sportDeleteService = async(sportsToBeDeleted)=>{
  const deleteObjects =  sportsToBeDeleted.sports.length === 0 ? 
  console.log('No Sport Selected'): 
  (db.data.sports = db.data.sports.filter(obj => !sportsToBeDeleted.sports.includes(obj.name)), db.write(), 'Events Deleted');
  // if (sportsToBeDeleted.sports.length === 0) {
  //   console.log('No Event Selected')
  // } else {
  //   db.data.sports = db.data.sports.filter(obj => !sportsToBeDeleted.sports.includes(obj.name));
  //   db.write()

  // }
await updateObjects(db.data)

  return deleteObjects
}

export const sportSearchService = async(filters)=>{
  const sports = db.data.sports.filter(sport => {
    return sport.name.match(new RegExp(filters.name, "i")) //&& event.active === true 
  });
  // console.log(sports.slice(0, filters.name))
  // console.log(sports)
await updateObjects(db.data)

  return sports
}


export const sportUpdateService = async(sportsToBeUpdated, result, answers)=>{
  const processSports  = async(sportsToBeUpdated)=>{
    const result = db.data.sports.find(object => object.name === sportsToBeUpdated.sports[0])
    console.log(db.data.sports.find(object => object.name === sportsToBeUpdated.sports[0]))
    return result
  }
  
  const processAnswers = async(result, answers)=>{
    const updatedSport = { ...result, ...answers }
    await updateArrayItem(db.data.sports, updatedSport.id, updatedSport);
    db.write()
    return updatedSport
  }
  // if(Array.isArray(sportsToBeUpdated)){
  if(sportsToBeUpdated){
    return processSports(sportsToBeUpdated)
  }else{
    return await processAnswers(result,answers)
  }
}

export const choicesAllSportsService = async()=>{
  return allSports(db.data.sports)
  
}

export const listAllSportsService = async()=>{
  const sports = db.data.sports
  sports.sort((a, b) => {
    return a.order - b.order;
  });
  return sports;
}

export const validateDuplicatedNames = async(input)=>{
  return (db.data.sports.some(sport => sport.name === input) ? 'Name Already Exists' : true)
}
