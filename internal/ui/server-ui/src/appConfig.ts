declare global {
  var APP_IS_EMBEDDED: 'true' | '__APP_IS_EMBEDDED__' | undefined
}

const isEmbedded = globalThis.APP_IS_EMBEDDED === 'true'
const deployEnv = isEmbedded ? 'production' : 'development'

const AppConfig = {
  deployEnv,
  apiBase: isEmbedded ? '' : 'http://localhost:8080',
}

export default AppConfig
