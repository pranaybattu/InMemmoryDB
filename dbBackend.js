const clone = require('clone')
const fs = require('fs')

class DB {
    constructor(){
        this.data = [{}]

        this.transactionIndex = 0

        this.transactionMode = false

        //'BEGIN'
        this.begin = function () {
            if(!this.transactionMode){
                this.transactionMode = true
            }
            this.data[this.transactionIndex+1] = clone(this.data[this.transactionIndex])
            this.transactionIndex++
        }

        this.set = function(name, value){
            if(this.transactionIndex === 0) {
                this.transactionIndex++
                this.transactionMode = true
                this.data[this.transactionIndex] = {}
            }
            if(!this.data[this.transactionIndex]){
                this.data[this.transactionIndex] = {}
            }
            if(name && name.length>0){
                this.data[this.transactionIndex][name] = value || null
            }
        }

        this.get = function (name) {
            let res = null

            if(name){
                res = this.data[this.transactionIndex][name]
            }
            return res ? res :`data with key='${name}' not found`
        }

        this.delete = function (name) {
            if (name) {
                if (this.data[this.transactionIndex][name]) {
                    delete this.data[this.transactionIndex][name]
                }
            }
        }

        this.count = function (value) {
            let count = 0
    
            if (value) {
                for (let property in this.data[this.transactionIndex]) {
                    if (this.data[this.transactionIndex].hasOwnProperty(property)) {
                        if (property && (this.data[this.transactionIndex][property] === value)) {
                            count++
                        }
                    }
                }
            }

            return count
        }

        this.commit = function () {
            if (this.transactionIndex === 0) {
                this.transactionMode = false
            }
            if (this.transactionIndex > 0) {
                // Sync Data from transaction
                this.data[this.transactionIndex-1] = clone(this.data[this.transactionIndex])
                // Clear out the transaction data
                this.data[this.transactionIndex] = {}
                // Point to earlier version of data
                this.transactionIndex++

                this.data[this.transactionIndex] = {}
          }
          return this.transactionIndex-2
        }

        this.rollback = function () {

            if (this.transactionIndex === 0) {
                return -1
            }

            if (this.transactionMode) {
                if(this.transactionIndex > 1) {
                    this.data[this.transactionIndex-1] = clone(this.data[this.transactionIndex-2])
                }
                else {
                    this.data[this.transactionIndex-1] = {}
                    this.data[this.transactionIndex] = {}
                    this.transactionMode = false

                }
                this.transactionIndex--
                 
            }

            return this.transactionIndex-1
        }

        this.download = function () {
            var db_dump
            this.data.forEach((entry) => {
              db_dump = JSON.stringify(entry);
            })
            fs.writeFileSync('database.json', db_dump)
            console.log("------- Saving DB to db_dump.json -------")
        }




    }
}

module.exports = DB