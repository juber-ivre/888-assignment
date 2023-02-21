import inquirer from 'inquirer'

import { sportCreateService, sportSearchService,sportDeleteService, sportUpdateService, choicesAllSportsService,
  validateDuplicatedNames, listAllSportsService} from '../services/sports.service.js'

  
import {main, submenu} from '../index.js'

// *** Create *** //
const createSport = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter sport name:',
      validate: async(input)=>{
        return validateDuplicatedNames(input)
      }
    },
    {
      type: 'input',
      name: 'displayName',
      message: 'Enter display name:',
    },
    // {
    //   type: 'confirm',
    //   name: 'active',
    //   message: 'Is sport active?',
    // },
  ])
  await sportCreateService(answers)
  console.log('Sport added successfully!');

  console.log(

  )
   await main()
};


// *** Search *** //
const searchSport = async () => {
  const filters = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter sport name:',
    },
  ])
const sports = await sportSearchService(filters)
console.log(sports)
console.log(
    
  )
 await main()
};

// *** Delete *** //
const deleteSport = async () => {
  const sportsToBeDeleted = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'sports',
      message: 'Sport to be deleted',
      choices: await choicesAllSportsService()
    },
  ])
 await sportDeleteService(sportsToBeDeleted)
 console.log('Deleted Successfully');
 console.log(
    
  )
  await  main()
};

// *** Update *** //
const updateSport = async () => {
  const sportsToBeUpdated = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'sports',
      message: 'Sports to be updated',
      choices: await choicesAllSportsService()
    },
  ])
  const result = await sportUpdateService(sportsToBeUpdated)

  if (result) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'displayName',
        message: 'Enter display name:',
      },
    ])
    await sportUpdateService('', result, answers)
    console.log('Update Successfully')
  };
    console.log(
    
      )
      await  main()
};


// *** List All *** //
 const listAllSports = async () => {
  const sports = await listAllSportsService()
  console.log(sports)
  console.log(
    
    )
    await  main()
};


export { createSport, searchSport, deleteSport, updateSport, listAllSports}
