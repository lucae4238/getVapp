#! /usr/bin/env node
const inquirer = require('inquirer');
const { buildProject } = require('../src');

(async function () {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      message: 'Pick the name of your app (dash-case):',
      name: 'name',
      default: 'my-app',
    },
    {
      type: 'list',
      message: 'App Type:',
      name: 'type',
      choices: ['Store', 'Admin', 'Service', 'My Account Plugin','Pixel', 'Empty'],
      default: 'Application',
    },
    {
      type: 'confirm',
      name: 'additionalReactFolders',
      message: 'Do you want additional React folders?',
      when: function (answers) {
        return !(['Empty', 'Service', 'Pixel'].includes(answers.type))
      },
    }
  ])
  buildProject(answers)
})()