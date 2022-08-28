const inquirer = require("inquirer");
inquirer.registerPrompt("datetime", require("inquirer-datepicker-prompt"));

exports.dateQuestion = [
  {
    type: "datetime",
    name: "reqdate",
    message:
      "For which date would you like to pull Sleep Data? (Use the notion date)",
    format: ["yyyy", "-", "mm", "-", "dd"],
    filter: (dt) => {
      var doura = new Date(dt); // set date for oura as user input new date object
      doura.setDate(doura.getDate() - 1); // reduce by 1 day
      doura = doura.toISOString().replace(/T.*/,'') // convert format of date
      dt = dt.toISOString().replace(/T.*/,'')
      dates = [doura, dt]
      return dates;
    },
  },
];
