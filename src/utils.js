
const handler = {
  'Store': {
    dependencies: [],
    builders: [["store", "0.x"], ["react", "3.x"]],
    files: [
      `/*./store/*.json`,
    ],
    ncpDirectory: [`../templates/storeBase`]

  },
  'Admin': {
    dependencies: [],
    builders: [["admin", "0.x"], ["react", "3.x"]],
    files: [
      `/admin/*`
    ],
    ncpDirectory: [`../templates/adminBase`]

  },
  'Service': {
    dependencies: [],
    builders: [["node", "6.x"]],
    files: [
      `/node/*.json`,
      `/node/*.ts`
    ],
    ncpDirectory: [`../templates/nodeBase`]

  },
  'My Account Plugin': {
    dependencies: [["vtex.my-account", "1.x"], ["vtex.my-account-commons", "1.x"]],
    builders: [["react", "3.x"]],
    files: [
      `/store/*.json`,
      `/react/*.js`
    ],
    ncpDirectory: [`../templates/pluginBase`]

  },
  'Pixel': {
    dependencies: [["vtex.pixel-interfaces", "1.x"]],
    builders: [["pixel", "0.x"], ["store", "0.x"], ["react", "3.x"]],
    files: [
      `/store/*.json`
    ],
    ncpDirectory: [`../templates/pixelBase`,]

  },
  "ReactBase": {additionalReactFolders
    dependencies: [],
    builders: [["react", "3.x"]],
    files: [],
    ncpDirectory: [`../templates/reactBase`]

  },
  'Base': {
    dependencies: [["vtex.css-handles", "0.x"], ["vtex.styleguide", "9.x"]],
    builders: [["messages", "1.x"], ["docs", "0.x"]],
    files: [
      `/*.md`,
      `/docs/README.md`,
      `/*.json`,
      `/public/metadata/messages/*.json`,
      `/public/metadata/licenses/*.md`,
    ],
    ncpDirectory: [`../templates/base`]

  }
}

export const getBuilders = (types) => {
  const builders = []
  types.forEach(type => {
    builders.push(handler[type].builders) 
  });

  return builders
}


export const getDependencies = (types) => {
  const dependen

}