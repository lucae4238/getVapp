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
      type: 'checkbox',
      message: 'App Type:',
      name: 'selectedTypes',
      choices: ['Store', 'Admin', 'Service', 'My Account Plugin','Pixel', 'Empty'],
      validate: (current) => {
        if(!current.length) return "Please select at least one option. Press Space to continue"
        if(current.length> 1 && current.includes("Empty")) return "Cant have 'Empty' and other options.Press Space to continue"
        return true

      },
      default:[ 'Store'],
    },
    {
      type: 'confirm',
      name: 'additionalReactFolders',
      message: 'Do you want additional React folders?',
      when: function (answers) {
        const shouldNotRenderOptions = ['Empty', 'Service', 'Pixel']
        return answers.selectedTypes.some(item => !(shouldNotRenderOptions.includes(item)))
      },
    }
  ])
  console.log("Creating a new VT APP...")
  await buildProject(answers)
})()