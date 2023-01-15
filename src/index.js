const util = require('util')
const fse = require('fs-extra');
const fs = require('fs')
const path = require('path')
const ncp = util.promisify(require('ncp').ncp) //install files
const replace = require('replace-in-file'); //replace myApp -> actual app name
const fmtjson = require('fmtjson') //formating
const chalk = require('chalk'); //console coloring
const { getBuilders, getDependencies, getFiles, downloadFiles, handleTypes, getInterfaces, getDirectoriesToFormat, getPlugins } = require('./utils');
const magenta = chalk.magenta; // Orange color

//react files
const reactComponentFile = "import React from 'react' \n \ninterface MyAppProps { \n \n} \n \nexport const MyApp: React.FC<MyAppProps> = ({ }) => { \n \treturn ( \n \t \t<> \n \t \t \t<div>hello</div> \n \t \t</> \n \t); \n}; \n \nexport default MyApp \n "
const exportReactFile = `import MyApp from  './components/MyApp' \nexport default MyApp`



// required for npm publish
const renameGitignore = (projectName) => {
  if (fs.existsSync(path.normalize(`${projectName}/gitignore`))) {
    fs.renameSync(
      path.normalize(`${projectName}/gitignore`),
      path.normalize(`${projectName}/.gitignore`)
    )
  }
}

const createReactFiles = async (capitalizedName, capitalizedCamelCase, files) => {
  await fse.outputFile(`${capitalizedName}/react/components/${capitalizedCamelCase}/index.tsx`, reactComponentFile);
  await fse.outputFile(`${capitalizedName}/react/${capitalizedCamelCase}.tsx`, exportReactFile);

  files.push(`${capitalizedName}/react/${capitalizedCamelCase}.tsx`)
}

const buildProject = async (project) => {
  const { name, selectedTypes, additionalReactFolders } = project



  // dynamicProduct (camelCase)
  // dynamicProduct (camelCase)
  // DynamicProduct (capitalized camelCase)
  // Dynamic Product (capitalized)
  const camelCase = name.split('-').reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
  const dashedName = name
  const capitalizedCamelCase = camelCase[0].toUpperCase() + camelCase.slice(1)
  const capitalizedName = dashedName.split("-").map(item => item[0].toUpperCase() + item.slice(1)).join(" ")
  

  const types = handleTypes(selectedTypes)
  const directoriesToFormat = getDirectoriesToFormat(types, capitalizedName)
  const plugins = getPlugins(types)
  const interfaces = getInterfaces(types)
  const builders = getBuilders(types)
  const dependencies = getDependencies(types)
  const files = getFiles(types, capitalizedName)

  await downloadFiles(types, capitalizedName)

  if (additionalReactFolders) {
    await ncp( path.join(__dirname, `../templates/advancedReactFolders`), capitalizedName )
    await createReactFiles(capitalizedName, capitalizedCamelCase, files)
  }

  const options = {
    files,
    //Replacement to make (string or regex) 
    from: [/MyApp/g, /MYAPP/g, /my-app/g, /myApp/g, "BUILDERS", "DEPENDENCIES", "INTERFACES", "PLUGINS"],
    to: [capitalizedCamelCase, capitalizedName, dashedName, camelCase, JSON.stringify(builders), JSON.stringify(dependencies), JSON.stringify(interfaces), JSON.stringify(plugins)],
  };
  await replace(options)

  //format json
  await fmtjson(directoriesToFormat)
  renameGitignore(capitalizedName)

  console.log(`\nDone! We suggest that you begin typing: \n \n -${magenta('cd')} ${capitalizedName} \n -${magenta('code .')} \n \n`)
}

module.exports = { buildProject } 
