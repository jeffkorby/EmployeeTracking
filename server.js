const mysql = require('mysql2');
const inquirer = require('inquirer');
const console = require('console.table');
const express = require('express');

const PORT = process.env.port || 4200;
const app = express();

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});