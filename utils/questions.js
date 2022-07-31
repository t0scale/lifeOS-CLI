const inquirer = require('inquirer')

exports.questions = [
  {
    type: "rawlist",
    name: "action",
    message: "What would you like to do from the following:",
    choices: [
      "Create a new Daily Tracking DB entry for today",
      "Update a previous date's sleep data",
      "Update incomplete Action Items to today's date",
      "Configure settings for this CLI"
    ],
    async filter(answer) {
      // await new Promise((r) => setTimeout(r, 3000))
      switch(answer) {
        case "Create a new Daily Tracking DB entry for today":
          return 1
        case "Update a previous date's sleep data":
          return 2
        case "Update incomplete Action Items to today's date":
          return 3
        case "Configure settings for this CLI":
          return 4
      }
    } 
  },
];
