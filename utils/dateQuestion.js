const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

exports.dateQuestion = [
  {
    type: "datetime",
    name: "date",
    message: "For which date would you like to pull Sleep Data (notion date)?",
    format: ["mm", "-", "dd", "-", "yyyy"],
    max: {
      year: new Date().getFullYear(),
      month: new Date().getMonth()+1,
      day: new Date().getDate()
    }
  },
];
