const inquirer = require("inquirer");
const { spawn } = require("child_process");

const questions = [
  {
    type: "list",
    name: "file",
    message: "Pilih yang akan kamu lakukan :",
    choices: ["Auto Reff & Generate", "Auto Verify Message"],
    filter: function (val) {
      return val;
    },
  },
];

inquirer.prompt(questions).then((answers) => {
  switch (answers.file) {
    case "Auto Reff & Generate":
      spawn("node", ["./script/refferral.js"], { stdio: "inherit" });
      break;
    case "Auto Verify Message":
      spawn("node", ["./script/autoVerify.js"], { stdio: "inherit" });
      break;
  }
});
