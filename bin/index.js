#! /usr/bin/env node
const inquirer = require('inquirer');
const { buildProject } = require('../src');

(async function () {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'Pick the name of your app (camelCase):',
      name: 'name',
      default: 'myApp',
    },
    {
      type: 'list',
      message: 'App Type:',
      name: 'type',
      choices: ['Empty', 'Store', 'Admin', 'Service', 'My Account Plugin'],
      default: 'Application',
    },
    {
      type: 'confirm',
      name: 'additionalReactFolders',
      message: 'Do you want to add additional react folders ?',
      when: function (answers) {
        return !(['Empty', 'Service'].includes(answers.type))
      },
    }
  ])
  buildProject(answers)
})()