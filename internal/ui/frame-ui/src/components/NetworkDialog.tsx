import Box from 'shared/Box.jsx'
import Button from 'shared/Button.tsx'
import { clsx } from 'shared/clsx.js'
import Icon from 'shared/Icon.jsx'
import Input from 'shared/Input.tsx'
import ArrowDropDown from 'shared/svgs/arrow_drop_down.svg?component-solid'
import ArrowDropUp from 'shared/svgs/arrow_drop_up.svg?component-solid'
import CheckBox from 'shared/svgs/check_box.svg?component-solid'
import CheckBoxOutlineBlank from 'shared/svgs/check_box_outline_blank.svg?component-solid'
import { sprinkles } from 'shared/theme/sprinkles.css.js'
import {
  createEffect,
  createSignal,
  For,
  onMount,
  Show,
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
  const [areNetworksVisible, setAreNetworksVisible] = createSignal(false)

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
        setAreNetworksVisible(false)
        setIsPasswordVisible(false)
        dialogRef.close()
      }
    }
  })

  return (
    <dialog
      ref={(el) => {
        dialogRef = el
      }}
      style={{ 'z-index': 1 }}
      onclose={() => {
        props.onClose()
      }}
    >
      <div class={clsx(fancyPaperClasses.root, sprinkles({ padding: 'x2' }))}>
        <Box marginBottom="x1">
          <div>Network Name (SSID):</div>

          <Input
            type="text"
            value={ssid()}
            onInput={(e) => {
              setSsid(e.currentTarget.value)
            }}
            sx={{ width: 'full' }}
          />
        </Box>

        <Box marginY="x1">
          <div>Password:</div>

          <Input
            ref={(el) => {
              passwordElementRef = el
            }}
            type={isPasswordVisible() ? 'text' : 'password'}
            value={password()}
            onInput={(e) => {
              setPassword(e.currentTarget.value)
            }}
            sx={{ width: 'full' }}
          />
        </Box>

        <Box
          marginY="x1"
          display="flexRow"
          flexAlign="centerY"
          gap="x1"
          onClick={() => {
            setIsPasswordVisible((prev) => !prev)
          }}
        >
          <Icon>
            {isPasswordVisible() ? <CheckBox /> : <CheckBoxOutlineBlank />}
          </Icon>
          <span>Show Password</span>
        </Box>

        <Button
          color="primary"
          size="medium"
          sx={{ width: 'full', marginY: 'x2' }}
          onClick={() => {
            if (ssid()) {
              fetch(`${AppConfig.apiBase}/api/wifi/connect`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ssid: ssid(),
                  password: password(),
                }),
              })
            }

            props.onClose()
          }}
        >
          Connect
        </Button>

        <hr />

        <Button
          color="secondary"
          size="small"
          onClick={() => {
            setAreNetworksVisible((prev) => !prev)
          }}
          sx={{ marginY: 'x2', width: 'full' }}
        >
          <span>Available Networks</span>
          <Icon>
            {areNetworksVisible() ? <ArrowDropUp /> : <ArrowDropDown />}
          </Icon>
        </Button>

        <Show when={areNetworksVisible()}>
          <div>
            <For each={data()?.networks ?? []}>
              {(network) => {
                return (
                  <Box
                    padding="x1"
                    cursor="pointer"
                    onClick={() => {
                      setSsid(network.ssid)
                      setPassword('')
                      passwordElementRef?.focus()
                    }}
                  >
                    {network.ssid}
                  </Box>
                )
              }}
            </For>
          </div>

          <Button
            color="secondary"
            size="small"
            onClick={() => refetch()}
            sx={{ marginY: 'x2', width: 'full' }}
          >
            Refresh
          </Button>
        </Show>

        <Button
          color="secondary"
          size="small"
          sx={{ width: 'full' }}
          onClick={() => {
            props.onClose()
          }}
        >
          Close
        </Button>
      </div>
    </dialog>
  )
}

export default NetworkDialog
