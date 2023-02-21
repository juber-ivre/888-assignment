import inquirer from 'inquirer'
import {marketDeleteService,marketCreateService,marketSearchService,marketUpdateService,choicesAllEventsService,choicesAllmarketsService,listAllMarketsService,
  validateDuplicatedNames} from '../services/markets.service.js'
  import {main, submenu} from '../index.js'


//*** Create Market */
export const createMarket = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter market name:',
      validate: async(input)=>{
        return validateDuplicatedNames(input)
      }
    },
    {
      type: 'input',
      name: 'displayName',
      message: 'Enter Display Name:',
    },
    {
      type: 'confirm',
      name: 'active',
      message: 'Is market active?',
    },
    {
      type: 'input',
      name: 'schema',
      message: 'Enter Schema:',
      validate: (input) => (!isNaN(input) ? true : 'Enter a number')
    },
    {
      type: 'input',
      name: 'columns',
      message: 'Enter Number of Columns:',
      validate: (input) => (!isNaN(input) ? true : 'Enter a number')
    },
    {
      type: 'list',
      name: 'event',
      message: 'Enter Event Asscociated with this Market:',
      //choices: allEvents(db.data.events)
      choices: await choicesAllEventsService()
    },
  ])

await marketCreateService(answers)
console.log(

  )
   await main()

};


//*** Search Market */
export const searchMarket = async () => {
  const filters = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter a regex to filter markets by name:',
    },
    {
      type: 'input',
      name: 'activeMarketsFilter',
      message: 'Enter a minimum number of active markets:',
      validate: (input) => (!isNaN(input) ? true : 'Enter a number')
    },
  ]);

await marketSearchService(filters)
console.log(

  )
   await main()
};


//*** Delete Market */
export const deleteMarket = async () => {
  const marketsToBeDeleted = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'market',
      message: 'Markets to be deleted',
      choices: await choicesAllmarketsService()
    },
  ])
 await marketDeleteService(marketsToBeDeleted)
 console.log(

  )
   await main()
};



//*** Update Market */
export const updateMarket = async () => {
  const marketsToBeUpdated = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'market',
      message: 'Market to be updated',
      choices: await choicesAllmarketsService()
    },
  ])
  const result = await marketUpdateService(marketsToBeUpdated)
  if (result) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'displayName',
        message: 'Enter Display Name:',
      },
      {
        type: 'confirm',
        name: 'active',
        message: 'Is market active?',
      },
      {
        type: 'input',
        name: 'schema',
        message: 'Enter Schema:',
        validate: (input) => (!isNaN(input) ? true : 'Enter a number')
      },
      {
        type: 'input',
        name: 'columns',
        message: 'Enter Number of Columns:',
        validate: (input) => (!isNaN(input) ? true : 'Enter a number')
      },
      {
        type: 'list',
        name: 'event',
        message: 'Enter Event Asscociated with this Market:',
        choices: await choicesAllEventsService()
      },
    ])

    await marketUpdateService('', result, answers)
    console.log('Update Successfully')
  }
    console.log(

      )
       await main()
};


//*** List All Markets */
export const listAllMarkets = async () => {
  await listAllMarketsService()
  console.log(

    )
     await main()
}

