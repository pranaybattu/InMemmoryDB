const readline = require('readline')
const path = require('path')
const dbBackend = require(path.resolve('./dbBackend'))

const readInput = readline.createInterface({
    input: process.stdin,
    // output: process.stdout,
    isDone: false
})

let db = new dbBackend()

console.log('@^@^@^@^@^@^@^@^@-In Memory Database Running-@^@^@^@^@^@^@^@^@')

readInput.on('line', input => {
    let readFromCMD = input.split(' ')
    let key = null
    let value = null
    let transactionIndex
    readFromCMD[0] = readFromCMD[0].toUpperCase()
    

    if(readFromCMD.length>1) key = readFromCMD[1]
    if(readFromCMD.length>2) value = readFromCMD[2]

    switch(readFromCMD[0]) {
        case 'HELP':
            console.log('options: \nSET <Key> <Val>\n' +
            'GET <Key>\nDELETE <Key>\nCOUNT <Val>\n' + 
            'BEGIN\nROLLBACK\nCOMMIT\nEND\n\n' + 
            '@^@^@^@^@^@^@^@^@-!!Options are not case sensitive!!-@^@^@^@^@^@^@^@^@\n\n')
            break
        case 'BEGIN':
            db.begin()
            break
        case 'SET':
            db.set(key,value)
            break
        case 'GET':
            console.log(db.get(key))
            break
        case 'DELETE':
            db.delete(key)
            break
        case 'COUNT':
            console.log(db.count(key))
            break
        case 'COMMIT':
            transactionIndex = db.commit()
            if(transactionIndex == -1) console.log('No active transactions!!');
            else console.log('Commited to DB with Transaction ID ' + transactionIndex)
            break
        case 'ROLLBACK':
            transactionIndex = db.rollback()
            if(transactionIndex === -1) console.log('No active transactions and DB is empty!!')
            else console.log('Rolled back to transaction with ID '+ transactionIndex)
            break 
        case 'DOWNLOAD':
            db.download()
            break
        case 'END':
            readInput.close()
            console.log('@^@^@^@^@^@^@^@^@-In Memory Database Closed!! See you again when you want to use this DB-@^@^@^@^@^@^@^@^@-')
            break
        default:
            console.log('\nInvalid input\n'+`Please use 'help' in case you require any assistance with possible operations\n`)
            break
    }
})