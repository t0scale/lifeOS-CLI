const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

exports.dateQuestion = [
  {
    type: "datetime",
    name: "dt",
    message: "For which date would you like to pull Sleep Data (notion date)?",
    format: ["mm", "/", "dd", "/", "yyyy"],
  },
];
