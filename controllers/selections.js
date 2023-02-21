import inquirer from 'inquirer'

import {selectionUpdateService, selectionCreateService, selectionDeleteService, selectionSearchService, choicesAllEventsService,
  choicesAllmarketsService,choicesAllSelectionsService, listAllSelectionsService, validateDuplicatedNames} from '../services/selections.service.js'

import {main, submenu} from '../index.js'

// *** Create *** //
export const createSelection = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter selection name:',
      validate: async(input)=>{
        return validateDuplicatedNames(input)
      }
    },
    {
      type: 'list',
      name: 'event',
      message: 'Enter Event Associated with this Selection:',
      choices: await choicesAllEventsService()
    },
    {
      type: 'list',
      name: 'market',
      message: 'Enter Market Associated with this Selection:',
      choices: await choicesAllmarketsService()
    },
    {
      type: 'input',
      name: 'price',
      message: 'Enter Price:',
      validate: (input) => (!isNaN(input) ? true : 'Enter a number')
    },
    {
      type: 'confirm',
      name: 'active',
      message: 'Is selection active?',
    },
    {
      type: 'list',
      name: 'outcome',
      message: 'Enter the Outcome :',
      choices:[ 'Unsettled','Void','Lose','Place', 'Win'] 
    },
  ])
await selectionCreateService(answers)
console.log(

  )
   await main()

};

export const searchSelection = async () => {
  const filters = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter selections name:',
    },
    {
      type: 'input',
      name: 'activeSelectionsFilter',
      message: 'Enter a minimum number of active selections:',
      validate: (input) => (!isNaN(input) ? true : 'Enter a number')
    },
  ]);
await selectionSearchService(filters)
console.log(

  )
   await main()
};


export const deleteSelection = async () => {
  const selectionsToBeDeleted = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selection',
      message: 'Selections to be deleted',
      choices: await choicesAllSelectionsService()
    },
  ])
 await selectionDeleteService(selectionsToBeDeleted)
 console.log(

  )
   await main()
};

export const updateSelection = async () => {
  const selectionsToBeUpdated = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selection',
      message: 'Selection to be updated',
      choices: await choicesAllSelectionsService()
    },
  ])

  const result = await selectionUpdateService(selectionsToBeUpdated)
  if (result) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'event',
        message: 'Enter Event Associated with this Selection:',
        choices: await choicesAllEventsService()
      },
      {
        type: 'list',
        name: 'market',
        message: 'Enter Market Associated with this Selection:',
        choices: await choicesAllmarketsService()
      },
      {
        type: 'input',
        name: 'price',
        message: 'Enter Price:',
        validate: (input) => (!isNaN(input) ? true : 'Enter a number')
      },
      {
        type: 'confirm',
        name: 'active',
        message: 'Is market active?',
      },
      {
        type: 'list',
        name: 'outcome',
        message: 'Enter the Outcome :',
        choices:[ 'Unsettled','Void','Lose','Place', 'Win'] 
      }
    ])
 
    await selectionUpdateService('', result, answers)
    console.log('Update Successfully')
  }
  console.log(

    )
     await main()
};

export const listAllSelections = async () => {
  await listAllSelectionsService()
  console.log(

    )
     await main()
 
}

