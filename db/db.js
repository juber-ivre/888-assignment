import * as dotenv from 'dotenv' 
import { Low } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
// let NODE_ENV = 'developemnt'
dotenv.config()
const dbFile = process.env.NODE_ENV === 'test' ? 'testDB.json' : 'DB.json'
// const dbFile = NODE_ENV === 'test' ? 'testDB.json' : 'file.json'
const db = new Low(new JSONFileSync(dbFile))
//const db = new Low(new JSONFileSync('file.json'))
//const db = new Low(new JSONFileSync('testDB.json'))


export {db}