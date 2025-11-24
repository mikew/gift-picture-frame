import Box from 'shared/Box.jsx'
import Button from 'shared/Button.tsx'
import { clsx } from 'shared/clsx.js'
import Input from 'shared/Input.tsx'
import { sprinkles } from 'shared/theme/sprinkles.css.js'
import {
  createEffect,
  createSignal,
  For,
  onMount,
  type Component,
} from 'solid-js'

import AppConfig from '#src/appConfig.ts'

import { fancyPaperClasses } from './FancyPaper.css'

async function fetchNetworks() {
  const response = await fetch(`${AppConfig.apiBase}/api/wifi/scan`)
  const json = await response.json()
  return json
}

const NetworkDialog: Component<{ open: boolean; onClose: () => void }> = (
  props,
) => {
  let dialogRef: HTMLDialogElement | undefined = undefined
  let passwordElementRef: HTMLInputElement | undefined = undefined

  const [data, setData] = createSignal<{ networks: { ssid: string }[] }>({
    networks: [],
  })

  async function refetch() {
    const networks = await fetchNetworks()
    setData(networks)
  }

  onMount(() => {
    refetch()
  })

  const [ssid, setSsid] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [isPasswordVisible, setIsPasswordVisible] = createSignal(false)

  createEffect(() => {
    if (dialogRef) {
      if (props.open) {
        try {
          dialogRef.showModal()
        } catch (e) {
          console.error('Failed to open dialog:', e)
        }
      } else {
        setSsid('')
        setPassword('')
        dialogRef.close()
      }
    }
  })

  return (
    <dialog
      // popover
      // open
      ref={(el) => {
        dialogRef = el
      }}
      style={{ 'z-index': 1 }}
      id="network-dialog"
      onclose={() => {
        props.onClose()
      }}
    >
      <div class={clsx(fancyPaperClasses.root, sprinkles({ padding: 'x2' }))}>
        <Box marginY="x1">
          Network Name (SSID):
          <br />
          <Input
            type="text"
            value={ssid()}
            onInput={(e) => {
              setSsid(e.currentTarget.value)
            }}
            style={{ width: '100%' }}
          />
        </Box>
        <Box marginY="x1">
          Password:
          <Input
            ref={(el) => {
              passwordElementRef = el
            }}
            type={isPasswordVisible() ? 'text' : 'password'}
            value={password()}
            onInput={(e) => {
              setPassword(e.currentTarget.value)
            }}
            style={{ width: '100%' }}
          />
        </Box>
        <Box marginY="x1">
          <label>
            <input
              type="checkbox"
              checked={isPasswordVisible()}
              onChange={(e) => setIsPasswordVisible(e.currentTarget.checked)}
            />
            Show Password
          </label>
        </Box>
        <Button
          color="primary"
          size="medium"
          sx={{ width: 'full', marginY: 'x2' }}
          onClick={async () => {
            await fetch(`${AppConfig.apiBase}/api/wifi/connect`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ssid: ssid(),
                password: password(),
              }),
            })
            props.onClose()
          }}
        >
          Connect
        </Button>
        <hr />
        Available Networks:
        <div>
          <For each={data()?.networks ?? []}>
            {(network) => {
              return (
                <div
                  onclick={() => {
                    setSsid(network.ssid)
                    setPassword('')
                    passwordElementRef?.focus()
                  }}
                >
                  {network.ssid}
                </div>
              )
            }}
          </For>
        </div>
      </div>
    </dialog>
  )
}

export default NetworkDialog
