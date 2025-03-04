const inquirer = require("inquirer");
const { spawn } = require("child_process");

const questions = [
  {
    type: "list",
    name: "file",
    message: "Pilih yang akan kamu lakukan :",
    choices: [
      "Auto Reff & Generate",
      "Auto Get Token",
      "Auto Verify Message",
      "Add Token",
      "Replace Semua Text",
    ],
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
    case "Auto Get Token":
      spawn("node", ["./script/getToken.js"], { stdio: "inherit" });
      break;
    case "Auto Verify Message":
      spawn("node", ["./script/autoVerify.js"], { stdio: "inherit" });
      break;
    case "Add Token":
      spawn("node", ["./script/addToken.js"], { stdio: "inherit" });
      break;
    case "Replace Semua Text":
      spawn("node", ["./script/replaceAll.js"], { stdio: "inherit" });
      break;
  }
});
