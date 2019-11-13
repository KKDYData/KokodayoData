const devMode = PRODUCTION ? '/' : '/ArknightsBeta'; //eslint-disable-line no-undef
const rootPath = process.env.NODE_ENV === 'development' || devMode === '/' ? '' : devMode;

export {
  devMode,
  rootPath
}; 
