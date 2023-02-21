import inquirer from 'inquirer'

import {eventCreateService, eventDeleteService, eventSearchService, eventUpdateService, choicesAllSportsService, validateDuplicatedNames , choicesAllEventsService, listAllEventsService} from '../services/events.service.js'
import {main, submenu} from '../index.js'

// *** Create ***//
export const createEvent = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter event name:',
      validate: async(input)=>{
        return validateDuplicatedNames(input)
      }
    },
    {
      type: 'list',
      name: 'eventType',
      message: 'Enter Event Type:',
      choices: ['Preplay', 'Inplay']
    },
    {
      type: 'list',
      name: 'sport',
      message: 'Enter Sports Asscociated with this Event:',
      choices:   await choicesAllSportsService()
    },
    {
      type: 'list',
      name: 'status',
      message: 'Enter Status:',
      choices: ['Preplay', 'Inplay', 'Ended']
    },
    // {
    //   type: 'confirm',
    //   name: 'active',
    //   message: 'Is event active?',
    // },
  ])

  await eventCreateService(answers)
  console.log(
    
    )
    main()
  
};

// *** Search ***//
export const searchEvent = async () => {
  const filters = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter Events name:',
    },
    {
      type: 'input',
      name: 'activeEventsFilter',
      message: 'Enter a minimum number of active events:',
      validate: (input) => (!isNaN(input) ? true : 'Enter a number')
    },
  ]);
  await eventSearchService(filters)
  console.log(
    
    )
    main()
  }


// *** Delete ***//
export const deleteEvent = async () => {
  const eventsToBeDeleted = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'events',
      message: 'Events to be deleted',
      choices: await choicesAllEventsService()
    },
  ])

  await eventDeleteService(eventsToBeDeleted)
  console.log(
    
    )
    main()
};


// *** Update ***//
export const updateEvent = async () => {
  const eventsToBeUpdated = await inquirer.prompt([
    {
      type: 'list',
      name: 'events',
      message: 'Events to be updated',
      choices: await choicesAllEventsService()
    },
  ])

const result = await eventUpdateService(eventsToBeUpdated)
  if (result) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'eventType',
        message: 'Event Type:',
        choices: ['Preplay', 'Inplay']
      },
      {
        type: 'list',
        name: 'sport',
        message: 'Enter Sports Asscociated with this Event:',
        choices: await choicesAllSportsService()
      },
      {
        type: 'list',
        name: 'status',
        message: 'Status Type:',
        choices: ['Preplay', 'Inplay', 'Ended']
      },
      {
        type: 'confirm',
        name: 'active',
        message: 'Is event active?',
      },
    ])

    await eventUpdateService('', result, answers)
    console.log('Update Successfully')
    
  } else {
    console.log('Event Not Found')
  }
  console.log(
    
    )
    main()
};


// *** List All *** //
export const listAllEvents = async () => {

  await listAllEventsService()
  console.log(
    
    )
    main()
}

