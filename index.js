import inquirer from 'inquirer'
import {createSport, listAllSports, deleteSport, searchSport, updateSport} from './controllers/sports.js'
import {createEvent, listAllEvents, deleteEvent, searchEvent, updateEvent} from './controllers/events.js'
import {createMarket, listAllMarkets, deleteMarket, searchMarket, updateMarket} from './controllers/markets.js'
import {createSelection, listAllSelections, deleteSelection, searchSelection, updateSelection} from './controllers/selections.js'

const submenuFunctions = {
  Sports: {
    Create: createSport,
    'List All': listAllSports,
    Delete: deleteSport,
    Search: searchSport,
    Update: updateSport
  },
  Events: {
    Create: createEvent,
    'List All': listAllEvents,
    Delete: deleteEvent,
    Search: searchEvent,
    Update: updateEvent
  },
  Markets: {
    Create: createMarket,
    'List All': listAllMarkets,
    Delete: deleteMarket,
    Search: searchMarket,
    Update: updateMarket
  },
  Selections: {
    Create: createSelection,
    'List All': listAllSelections,
    Delete: deleteSelection,
    Search: searchSelection,
    Update: updateSelection
  }
};
let inSubMenu = false;
async function main() {
  if (!inSubMenu) {
  let shouldQuit = false;
  while (!shouldQuit) {
    const answers =  await inquirer.prompt([
     {
       type: 'list',
       name: 'choice',
       message: 'Choose one of the following options to expand?',
       choices: ['Sports', 'Events', 'Markets', 'Selections', 'Quit'],
     },
   ])
    console.log(
      ` You have selected ${answers.choice}`
    );
    if(answers.choice === 'Quit'){

      console.log('GoodBye')
      shouldQuit = true;
      // process.exit(0);
    } else{
      inSubMenu = true;
      await submenu(answers.choice)
      inSubMenu = false;
    } 
  }
}
}


async function submenu(value){
    console.log(value)

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'subchoice',
        message: 'What would you like to do?',
        choices: ['Create', 'Update', 'Delete', 'Search', 'List All','Back'],
      },
    ])

     if(answers.subchoice === 'Back'){
       main();
       return
     } 
    
     switch (answers.subchoice) {
      case 'Create':
      case 'List All':
      case 'Delete':
      case 'Search':
      case 'Update':
        // console.log(submenuFunctions[value][answers.subchoice])
         const fn = submenuFunctions[value][answers.subchoice]();
         await fn
        break;
      default:
        console.error('Invalid option selected');
        break;
    }
   }

   main();
 export {main, submenu}



 