const util = require('util')
const mapSeries = require('async/mapSeries')
const path = require('path')
const ncp = util.promisify(require('ncp').ncp) //install files

const handler = {
  'Store': {
    dependencies: [],
    builders: [["store", "0.x"]],
    interfaces: { "my-app": { "component": "myApp" } },
    plugins: {},
    files: [
      `/store/*.json`,
    ],
    ncpDirectory: `../templates/storeBase`

  },
  'Admin': {
    dependencies: [],
    builders: [["admin", "0.x"]],
    interfaces: {},
    plugins: {},
    files: [
      `/admin/*`
    ],
    ncpDirectory: `../templates/adminBase`

  },
  'Service': {
    dependencies: [],
    builders: [["node", "6.x"]],
    interfaces: {},
    plugins: {},
    files: [
      `/node/*.json`,
      `/node/*.ts`
    ],
    ncpDirectory: `../templates/nodeBase`

  },
  'My Account Plugin': {
    dependencies: [["vtex.my-account", "1.x"], ["vtex.my-account-commons", "1.x"]],
    builders: [],
    interfaces: { "my-account-link.my-app-link": { "component": "MyAppLink" }, "my-account-page.my-app-page": { "component": "MyAppPage" } },
    plugins: { "my-account-menu > my-account-link": "my-account-link.my-app-link", "my-account-pages > my-account-page": "my-account-page.my-app-page" },
    files: [
      `/store/*.json`,
      `/react/*.js`
    ],
    ncpDirectory: `../templates/pluginBase`

  },
  'Pixel': {
    dependencies: [["vtex.pixel-interfaces", "1.x"]],
    builders: [["pixel", "0.x"], ["store", "0.x"]],
    interfaces: { "pixel.my-app": { "component": "index" } },
    plugins: { "pixels > pixel": "pixel.my-app" } ,
    files: [
      `/store/*.json`
    ],
    ncpDirectory: `../templates/pixelBase`,

  },
  "ReactBase": {
    dependencies: [],
    builders: [["react", "3.x"]],
    interfaces: {},
    plugins: {},
    files: [],
    ncpDirectory: `../templates/reactBase`

  },
  'Base': {
    dependencies: [["vtex.css-handles", "0.x"], ["vtex.styleguide", "9.x"]],
    builders: [["messages", "1.x"], ["docs", "0.x"]],
    interfaces: {},
    plugins: {},
    files: [
      `/*.md`,
      `/docs/README.md`,
      `/*.json`,
      `/public/metadata/messages/*.json`,
      `/public/metadata/licenses/*.md`,
    ],
    ncpDirectory: `../templates/base`

  }
}

const getBuilders = (types) => {
  let builders = []
  types.forEach(type => {
    builders = [...builders, ...handler[type].builders]
  });

  return Object.fromEntries(builders)
}
const getPlugins = (types) => {
  let plugins = {}
  types.forEach(type => {
    plugins = Object.assign(plugins, handler[type].plugins)
  });
  return plugins
}
const getInterfaces = (types) => {
  let interfaces = {}
  types.forEach(type => {
    interfaces = Object.assign(interfaces, handler[type].interfaces)
  });
  return interfaces
}

const getDirectoriesToFormat = (types, capitalizedName) => {
  const directories = [`./${capitalizedName}/manifest.json`,]
  const typesWithInterfaces = ["Store", "Pixel", "My Account Plugin"]
  const typesWithPlugins = ["Pixel", "My Account Plugin"]

  if (types.some(type => typesWithPlugins.includes(type))) {
    directories.push(`./${capitalizedName}/store/plugins.json`,)
  }
  if (types.some(type => typesWithInterfaces.includes(type))) {
    directories.push(`./${capitalizedName}/store/interfaces.json`,)
  }
  return directories

}

const getFiles = (types, capitalizedName) => {
  let files = []
  types.forEach(type => {
    files = [...files, ...handler[type].files]
  });
  return files.map(item => `${capitalizedName}${item}`)

}

const getDependencies = (types) => {
  let dependencies = []
  types.forEach(type => {
    dependencies = [...dependencies, ...handler[type].dependencies]
  });

  return Object.fromEntries(dependencies)
}

const handleTypes = (selectedTypes) => {
  let types = [...selectedTypes]
  if (types[0] === "Empty") return ["Base"]

  if (types.some(item => item !== "Empty" && item !== "Service")) types.push("ReactBase")
  types.push("Base")
  return types
}

const downloadFiles = async (types, capitalizedName) => {
  try {
    const directories = types.map(type => handler[type].ncpDirectory)
    await mapSeries(directories, async (directory) => { await ncp(path.join(__dirname, directory), capitalizedName) })
    return
  } catch (error) {
    console.log('Error downloading files', error)
  }
}


module.exports = {
  getBuilders,
  getDependencies,
  downloadFiles,
  getFiles,
  handleTypes,
  getDirectoriesToFormat,
  getInterfaces,
  getPlugins
}