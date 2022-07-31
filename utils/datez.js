const {leadingZero} = require('./leadingZero.js')

let year = new Date().getFullYear().toString()
let month = new Date().getMonth() + 1
month = leadingZero(month)
let day = new Date().getDate()

// Create today's date
exports.today = function today() {
  day = leadingZero(day)
  // console.log(`${year}-${month}-${day}`)
  return `${year}-${month}-${day}`
}

// Create yesterday's date
// Oura uses the previous date for today
// todo confirm this works if date is first day
// todo of the month where day will be '0'
exports.ouraDate = function ouraDate() {
  let ouraDay = day - 1
  ouraDay = leadingZero(ouraDay)
  // console.log(`${year}-${month}-${ouraDay}`)
  return `${year}-${month}-${ouraDay}`
}