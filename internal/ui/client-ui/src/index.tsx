import { render } from 'solid-js/web'

import App from '#src/components/App.tsx'

import './index.css'

const root = document.getElementById('app')

if (!root) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(() => <App />, root)
