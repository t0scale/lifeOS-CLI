#!/usr/bin/env node

// borrowed from: https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs
// how this works:
// create a node app using mkdir, then 'npm init'
// create a 'bin' folder in the root dir
// in the 'bin' folder, add a new file - index.js
// update 'package-json' main key from:
// "main": "index.js"
// to
// "main": "bin/index.js"
// then also add to the bottom of 'package-json'
// "bin": {
//   "hello": "./bin/index.js"
// }
// this makes it so you can run the hello command anywhere
// final step - npm install -g ['app name/dir'] last part not needed if in the root dir
// app can be removed with npm uninstall -g 'app name/dir'
// also note the first line - required to let terminal know what you are running.
const dotenv = require('dotenv')
dotenv.config({path: '../.env'})
const inquirer = require('inquirer')
const {questions} = require('../utils/questions.js')
const {dateQuestion} = require('../utils/dateQuestion.js')

// * Import the various automations...
const { LastNightSleep } = require('../lib/newDailyTracking.js')

const { aiToToday } = require('../lib/aiToToday.js')

inquirer.prompt(questions)
.then((answers) => {
  if (answers.action === 1) {
    LastNightSleep()
  } else if(answers.action === 2) {
    inquirer.prompt(dateQuestion)
    updateSleepData()
  }else if(answers.action === 3) {
    aiToToday()
  } else console.log(answers)

})
.catch((error) => {
  if (error.isTtyError) {
    // Prompt couldn't be rendered in the current environment
  } else {
    // Something else went wrong.
  }
})
