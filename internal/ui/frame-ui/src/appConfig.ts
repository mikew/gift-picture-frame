declare global {
  var APP_IS_EMBEDDED: 'true' | '__APP_IS_EMBEDDED__' | undefined
}

const isEmbedded = globalThis.APP_IS_EMBEDDED === 'true'
const deployEnv = isEmbedded ? 'production' : 'development'

const AppConfig = {
  deployEnv,
  apiBase: isEmbedded ? '' : 'http://localhost:6376',
}

export default AppConfig
