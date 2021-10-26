const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const express = require("express");
const util = require("util");

const PORT = process.env.PORT || 4200;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const connection = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Stormblessed",
    database: "tracker_db"
  },
  console.log("Connected to the tracker_db database")
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connection.connect(function (err) {
    if (err) throw err;
    startPrompt();
});

const startPrompt = () => {
    inquirer.prompt([{
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Role",
                "Add Employee",
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Update an Employee's Role",
                "Update an Employee's Manager",
                "Remove an Employee",
                "Exit",
            ]
        }

        ]).then((answer) => {
            switch (answer.action) {
                case "Add Department":
                    departmentAdd();
                    break;

                case "Add Role":
                    roleAdd();
                    break;

                case "Add Employee":
                    employeeAdd();
                    break;

                case "View all Departments":
                    departmentView();
                    break;

                case "View all Roles":
                    roleView();
                    break;

                case "View all Employees":
                    employeeView();
                    break;

                case "Update an Employee's Role":
                    employeeUpdate();
                    break;

                case "Update an Employee's Manager":
                    employeeManagerUpdate();
                    break;

                case "Remove a Role":
                    roleRemove();
                    break;

                case "Remove an Employee":
                    employeeRemove();
                    break;

                case "Exit":
                    connection.end();
                    break;
            }
        })
}

const departmentAdd = () => {
    inquirer
        .prompt([{
            name: "departmentAdd",
            type: "input",
            message: "What is the name of the department you would like to add?",
        }])
        .then((answer) => {
            connection.query(
                "INSERT INTO department SET ?", {
                department_name: answer.departmentAdd
            },
                function (err) {
                    if (err) throw err;
                    console.log("Added " + answer.departmentAdd + " as a Department.");
                    startPrompt();
                }
            )
        })
}

const roleAdd = () => {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "roleAdd",
                type: "input",
                message: "What is the name of the new role you would like to add?"
            },

            {
                name: "salary",
                type: "number",
                message: "Enter the salary for the new role."
            },

            {
                name: "department_id",
                type: "list",
                message: "Enter a department for the new role.",
                choices: results.map(item => item.department_name)
            },

            ])
            .then((answer) => {
                const departmentChosen = results.find(item => item.department_name === answer.department_id)

                connection.query("INSERT INTO roles SET ?", {
                    title: answer.roleAdd,
                    salary: answer.salary,
                    department_id: departmentChosen.id
                },
                    function (err) {
                        if (err) throw err;
                        console.log("Added " + answer.roleAdd + " as a role.");
                        startPrompt();
                    }
                )
            })
    })
}

const employeeAdd = () => {
    connection.query("SELECT * FROM roles", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employeeAdd",
                type: "input",
                message: "Enter the first name of the employee you'd like to add.",
            },

            {
                name: "last_name",
                type: "input",
                message: "Enter the new employees' last name."
            },

            {
                name: "roles_id",
                type: "list",
                message: "Select the role for this employee:",
                choices: results.map(item => item.title)
            },
            ])

            .then((answer) => {
                const roleChosen = results.find(item => item.title === answer.roles_id)
                const employeeFirstName = answer.employeeAdd
                const employeeLastName = answer.last_name;
                connection.query("SELECT * FROM employee", function (err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([{
                            name: "manager_id",
                            type: "list",
                            message: "Select this employee's manager:",
                            choices: results.map(item => item.first_name)
                        }
                        ])
                        .then((answer) => {
                            const managerChosen = results.find(item => item.first_name === answer.manager_id)

                            connection.query(
                                "INSERT INTO employee SET ?", {
                                first_name: employeeFirstName,
                                last_name: employeeLastName,
                                roles_id: roleChosen.id,
                                manager_id: managerChosen.id
                            },
                                function (err) {
                                    if (err) throw err;
                                    console.log("Successfully added " + employeeFirstName + " " + employeeLastName + ".");
                                    startPrompt();
                                }
                            )
                        })
                })
            })
    })
}

const departmentView = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res)
        startPrompt();
    })
}

const roleView = () => {
    connection.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        console.table(res)
        startPrompt();
    })
}

const employeeView = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res)
        startPrompt();
    })
}

const employeeUpdate = () => {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employeeUpdate",
                type: "list",
                message: "Choose which employee you want to update.",
                choices: results.map(item => item.first_name)
            },
            ])

            .then((answer) => {
                const updateEmployee = (answer.employeeUpdate)
                connection.query("SELECT * from roles", function (err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([{
                            name: "roles_id",
                            type: "list",
                            message: "Select the new role of the employee:",
                            choices: results.map(item => item.title)
                        },
                        ])

                        .then((answer) => {
                            const roleChosen = results.find(item => item.title === answer.roles_id)

                            connection.query("UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployee + "'", {
                                roles_id: "" + roleChosen.id + "",
                            },
                                function (err) {
                                    if (err) throw err;
                                    console.log("Successfully updated role to " + answer.roles_id + ".");
                                    startPrompt();
                                }
                            )
                        })
                })
            })
    })
}

const employeeManagerUpdate = () => {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employeeUpdateManager",
                type: "list",
                message: "Select the employee who needs their manager updated:",
                choices: results.map(item => item.first_name)
            },
            ])

            .then((answer) => {
                const updateEmployeeManager = (answer.employeeUpdateManager)
                connection.query("SELECT * FROM employee", function (err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([{
                            name: "manager_id",
                            type: "list",
                            message: "Select the updated manager for the chosen employee:",
                            choices: results.map(item => item.first_name)
                        },
                        ])

                        .then((answer) => {
                            const managerChosenUpdated = results.find(item => item.first_name === answer.manager_id)

                            connection.query(
                                "UPDATE employee SET ? WHERE first_name = " + "'" + updateEmployeeManager + "'", {
                                manager_id: "" + managerChosenUpdated.id + "",
                            },
                                function (err) {
                                    if (err) throw err;
                                    console.log("Successfully updated manager to " + answer.manager_id + ".");
                                    startPrompt();
                                }
                            )
                        })
                })
            })
    })
}

const employeeRemove = () => {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                name: "employeeDeleteName",
                type: "list",
                message: "Select the employee you want to remove:",
                choices: results.map(item => item.first_name),
            },
            ])
            .then((answer) => {
                    const employeeRemove1 = results.find(item => item.first_name === answer.employeeDeleteName)
                    const employeeRemove2 = employeeRemove1.id
                    connection.query("DELETE FROM employee WHERE id = " + "'" + employeeRemove2 + "'",
                        function (err) {
                            if (err) throw err;
                            console.log("Successfully removed " + answer.employeeDeleteName + ".");
                            startPrompt();
                        }
                    )
                })
            }) 
}
