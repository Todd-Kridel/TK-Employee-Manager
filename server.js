

//
// Include packages that are needed for the application.
//
const theInquirerObject = require("inquirer");
const theDatabaseObject = require("MySQL2");
const theConsoleTableObject = require("console.table");  // for printing MySQL rows to the console
const { join } = require("path");


//
// Create the connection to the database.
//
const theDatabaseConnection = theDatabaseObject.createConnection({
host: 'localhost', 
user: 'github', 
password: 'User0@GH', 
database: 'employee_manager_db'
});


//
// Create a function that will get from the manager the next desired information entry action 
// that is necessary for processing of the employee database through the main system menu.
//
// GIVEN a command-line application that accepts user input
// WHEN I start the application...
// THEN I am presented with the following options: view all departments, view all roles, 
// view all employees, add a department, add a role, add an employee, and update an employee 
// role.
//
function doGetMainMenuInformationEntryActions() {
//
// Create a detail array and process for the prompt and data-gathering questions that are 
// to be asked for the main menu of the application by using the Inquirer system.
//
const theMainMenuInformationEntryOptions = 
[
"View All Employees", 
"Add Employee", 
"Update Employee Role", 
"View All Roles", 
"Add Role", 
"View All Departments", 
"Add Department", 
"Quit"
];
//
const theMainMenuInformationEntryOptionQuestions = 
[
{
name: "theMainMenuInformationEntryAction", 
type: "list", 
message: "What would you like to do?", 
choices: theMainMenuInformationEntryOptions
}
];
//
// Issue a call to the prompt function of the Inquirer object to get main menu information for 
// the employee database.
//
theInquirerObject
.prompt(theMainMenuInformationEntryOptionQuestions)
.then((answer) => {
  //console.log(answer.theMainMenuInformationEntryAction);
  //
  // Call to the utility function that processes the database action that corresponds to the 
  // selected menu option.
  //
  switch (answer.theMainMenuInformationEntryAction) { 
  //
  case "View All Employees": 
    doProcessMenuOptionViewAllEmployees();
    break;  
  case "Add Employee": 
    doProcessMenuOptionAddEmployee();
    break;
  case "Update Employee Role":
    doProcessMenuOptionUpdateEmployeeRole();
    break;
  case "View All Roles":
    doProcessMenuOptionViewAllRoles();
    break;
  case "Add Role":
    doProcessMenuOptionAddRole();
    break;
  case "View All Departments":
    doProcessMenuOptionViewAllDepartments();
    break;
  case "Add Department":
    doProcessMenuOptionAddDepartment();
    break;
  case "Quit":
    doProcessMenuOptionQuit();
    break;
  //
  }; 
//
})
.catch((error) => {
  if (error.isTtyError) {
  // Prompt could not be rendered in the current environment.
  }
  else {
  // A problem occurred with the utility-function processing of the prompt answer data.
  console.log(error);
  //"ERROR: A problem occurred with the processing of the prompt answer data.");
  };
});
//
}

