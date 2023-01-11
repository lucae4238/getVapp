const util = require('util')
const fse = require('fs-extra');
const fs = require('fs')
const path = require('path')
const ncp = util.promisify(require('ncp').ncp) //install files
const replace = require('replace-in-file'); //replace myApp -> actual app name
const fmtjson = require('fmtjson') //formating
const chalk = require('chalk'); //console coloring
const magenta = chalk.magenta; // Orange color

//react files
const reactComponentFile = "import React from 'react' \n \ninterface MyAppProps { \n \n} \n \nexport const MyApp: React.FC<MyAppProps> = ({ }) => { \n \treturn ( \n \t \t<> \n \t \t \t<div>hello</div> \n \t \t</> \n \t); \n}; \n \nexport default MyApp \n "
const exportReactFile = `import MyApp from  './components/MyApp \nexport default MyApp`



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
  const { name, type, additionalReactFolders } = project

  // dynamicProduct (camelCase)
  // dynamicProduct (camelCase)
  // DynamicProduct (capitalized camelCase)
  // Dynamic Product (capitalized)
  const camelCase = name.split('-').reduce((a, b) => a + b.charAt(0).toUpperCase() + b.slice(1));
  const dashedName = name
  const capitalizedCamelCase = camelCase[0].toUpperCase() + camelCase.slice(1)
  const capitalizedName = dashedName.split("-").map(item => item[0].toUpperCase() + item.slice(1)).join(" ")

  const builders = {
    "messages": "1.x",
    "docs": "0.x"
  }
  const dependencies = {
    "vtex.styleguide": "9.x",
    "vtex.css-handles": "0.x",
  }
  const files = [
    `${capitalizedName}/*.md`,
    `${capitalizedName}/docs/README.md`,
    `${capitalizedName}/*.json`,
    `${capitalizedName}/public/metadata/messages/*.json`,
    `${capitalizedName}/public/metadata/licenses/*.md`,
  ]
  await ncp(
    path.join(__dirname, `../templates/base`),
    capitalizedName
  )


  switch (type) {
    case 'Admin':
      {
        await ncp(
          path.join(__dirname, `../templates/adminBase`),
          capitalizedName
        )

        files.push(`${capitalizedName}/admin/*`)
        builders.admin = "0.x"
        break
      }

    case 'Service':
      {
        await ncp(
          path.join(__dirname, `../templates/nodeBase`),
          capitalizedName
        )

        builders.node = "6.x"
        files.push(`${capitalizedName}/node/*.json`)
        files.push(`${capitalizedName}/node/*.ts`)
        break
      }

    case 'My Account Plugin':
      {
        await ncp(
          path.join(__dirname, `../templates/pluginBase`),
          capitalizedName
        )
        files.push(`${capitalizedName}/store/*.json`)
        files.push(`${capitalizedName}/react/*.js`)

        dependencies["vtex.my-account"] = "1.x"
        dependencies["vtex.my-account-commons"] = "1.x"
        break
      }
    case 'Store':
      {
        await ncp(
          path.join(__dirname, `../templates/storeBase`),
          capitalizedName
        )
        builders.store = "0.x"
        files.push(`${capitalizedName}/store/*.json`)
        break
      }
    case 'Pixel':
      {
        await ncp(
          path.join(__dirname, `../templates/pixelBase`),
          capitalizedName
        )

        builders.store = "0.x"
        builders.pixel = "0.x"
        builders.react = "3.x"
        dependencies["vtex.pixel-interfaces"] = "1.x"
        files.push(`${capitalizedName}/store/*.json`)
        break
      }
  }

  if (!(['Empty', 'Service'].includes(type))) {
    builders.react = "3.x"
    await ncp(
      path.join(__dirname, `../templates/reactBase`),
      capitalizedName
    )

    if (additionalReactFolders) {
      await ncp(
        path.join(__dirname, `../templates/advancedReactFolders`),
        capitalizedName
      )
      await createReactFiles(capitalizedName, capitalizedCamelCase, files)
    }
  }

  const options = {
    files,
    //Replacement to make (string or regex) 
    from: [/MyApp/g, /MYAPP/g, /my-app/g, /myApp/g, "BUILDERS", "DEPENDENCIES"],
    to: [capitalizedCamelCase, capitalizedName, dashedName, camelCase, JSON.stringify(builders), JSON.stringify(dependencies)],
  };
  await replace(options)

  //format json
  await fmtjson([
    `./${capitalizedName}/manifest.json`,
  ], {
    sort: false,
  })
  renameGitignore(capitalizedName)

  console.log(`\nDone! We suggest that you begin typing: \n \n -${magenta('cd')} ${capitalizedName} \n -${magenta('code .')} \n \n`)
}

module.exports = { buildProject } 
