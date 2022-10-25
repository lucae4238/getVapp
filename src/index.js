const util = require('util')
const fs = require('fs')
const path = require('path')
const ncp = util.promisify(require('ncp').ncp)
const replace = require('replace-in-file');


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

  const dashedName = name.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
  const capitalizedCamelCase = name[0].toUpperCase() + name.slice(1)
  const capitalizedName = dashedName.replace("-", " ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  const builders = {
    "messages": "1.x",
  }
  const dependencies = {
    "vtex.styleguide": "9.x",
    "vtex.css-handles": "0.x",
  }
  const files = [
    `${name}/*.md`,
    `${name}/*.json`,
    `${name}/public/metadata/messages/*.json`,
    `${name}/public/metadata/licenses/*.md`,
  ]
  await ncp(
    path.join(__dirname, `../templates/base`),
    name
  )


  switch (type) {

    case 'Empty':
      {
        await ncp(
          path.join(__dirname, `../templates/base`),
          name
        )
      }
      break
    case 'Admin':
      {
        await ncp(
          path.join(__dirname, `../templates/adminBase`),
          name
        )
        files.push(`${name}/admin/*`)
        builders.admin = "0.x"
        break
      }
    case 'Service':
      {
        await ncp(
          path.join(__dirname, `../templates/nodeBase`),
          name
        )
      }
      builders.node = "6.x"
      files.push(`${name}/node/*.json`)
      files.push(`${name}/node/*.ts`)
      break
    case 'My Account Plugin':
      {

        {
          await ncp(
            path.join(__dirname, `../templates/pluginBase`),
            name
          )
        }

        files.push(`${name}/store/*.json`)
        files.push(`${name}/react/*.js`)


        dependencies["vtex.my-account"] = "1.x"
        dependencies["vtex.my-account-commons"] = "1.x"
        break
      }
    case 'Store':
      {
        await ncp(
          path.join(__dirname, `../templates/storeBase`),
          name
        )
        builders.store = "0.x"
        files.push(`${name}/store/*.json`)
      }
  }
  if (!(['Empty', 'Service'].includes(type))) {
    builders.react = "3.x"
    await ncp(
      path.join(__dirname, `../templates/reactBase`),
      name
    )

    if (additionalReactFolders) {
      await ncp(
        path.join(__dirname, `../templates/advancedReactFolders`),
        name
      )
    }
  }
  const options = {
    files,
    //Replacement to make (string or regex) 
    from: [/MyApp/g, /MYAPP/g, /my-app/g, /myApp/g, "BUILDERS", "DEPENDENCIES"],
    to: [capitalizedCamelCase, capitalizedName, dashedName, name, JSON.stringify(builders), JSON.stringify(dependencies)],
  };
  await replace(options)
  renameGitignore(name)

  glob.sync(`${name}/**/*`).forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      templateFile(file, profiler)
    }
  })
}

module.exports = { buildProject } 
