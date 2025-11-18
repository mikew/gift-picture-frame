import {
  createEffect,
  createSignal,
  For,
  onMount,
  type Component,
} from 'solid-js'

import AppConfig from '#src/appConfig.ts'

async function fetchNetworks() {
  const response = await fetch(`${AppConfig.apiBase}/api/wifi/scan`)
  const json = await response.json()
  return json
}

const NetworkDialog: Component<{ open: boolean; onClose: () => void }> = (
  props,
) => {
  let dialogRef: HTMLDialogElement | undefined = undefined
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
        dialogRef.close()
      }
    }
  })

  return (
    <dialog
      open={props.open}
      class="network-dialog"
      ref={(el) => {
        dialogRef = el
      }}
      style={{ 'z-index': 1 }}
    >
      <div
        style={{
          'padding': '8px',
          'background-color': '#111',
        }}
      >
        Network Name (SSID):
        <br />
        <input
          type="text"
          value={ssid()}
          onInput={(e) => {
            setSsid(e.currentTarget.value)
          }}
          style={{ width: '100%' }}
        />
        <br />
        Password:
        <br />
        <input
          type={isPasswordVisible() ? 'text' : 'password'}
          value={password()}
          onInput={(e) => {
            setPassword(e.currentTarget.value)
          }}
          style={{ width: '100%' }}
        />
        <br />
        <label>
          <input
            type="checkbox"
            checked={isPasswordVisible()}
            onChange={(e) => setIsPasswordVisible(e.currentTarget.checked)}
          />
          Show Password
        </label>
        <br />
        <button
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
        </button>
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
