const util = require('util')
const fs = require('fs')
const path = require('path')
const ncp = util.promisify(require('ncp').ncp) //install files
const replace = require('replace-in-file'); //replace myApp -> actual app name
const fmtjson = require('fmtjson') //formating
const chalk = require('chalk');
const warning = chalk.magenta; // Orange color



// dynamicProduct (camelCase)
// dynamic-product (dashed)
// Dynamic Product (capitalized)


// required for npm publish
const renameGitignore = (projectName) => {
  if (fs.existsSync(path.normalize(`${projectName}/gitignore`))) {
    fs.renameSync(
      path.normalize(`${projectName}/gitignore`),
      path.normalize(`${projectName}/.gitignore`)
    )
  }
}

const buildProject = async (project) => {
  const { name, type, additionalReactFolders } = project

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
    `${capitalizedName}/docs/*.md`,
    `${capitalizedName}/*.json`,
    `${capitalizedName}/public/metadata/messages/*.json`,
    `${capitalizedName}/public/metadata/licenses/*.md`,
  ]
  await ncp(
    path.join(__dirname, `../templates/base`),
    capitalizedName
  )


  switch (type) {

    case 'Empty':
      {
        await ncp(
          path.join(__dirname, `../templates/base`),
          capitalizedName
        )
      }
      break

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
    }
  }
  const options = {
    files,
    //Replacement to make (string or regex) 
    from: [/MyApp/g, /MYAPP/g, /my-app/g, /myApp/g, "BUILDERS", "DEPENDENCIES"],
    to: [capitalizedCamelCase, capitalizedName, dashedName, camelCase, JSON.stringify(builders), JSON.stringify(dependencies)],
  };
  await replace(options)
  await fmtjson([
    `./${capitalizedName}/manifest.json`
  ], {
    sort: false,
  })
  renameGitignore(capitalizedName)
  console.log(`\n Done! We suggest that you begin typing: \n \n -${warning('cd')} ${capitalizedName} \n -${warning('code .')} \n \n`)
}

module.exports = { buildProject } 
