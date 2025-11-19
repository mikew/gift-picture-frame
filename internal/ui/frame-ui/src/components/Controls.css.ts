import { style } from '@vanilla-extract/css'
import { iconClassess } from 'shared/Icon.css.js'
import { themeContract } from 'shared/theme/contract.css.ts'
import { sprinkles } from 'shared/theme/sprinkles.css.ts'

export const container = style([
  sprinkles({
    position: 'absolute',
    display: 'flexRow',
    flexAlign: 'centerAll',
    gap: 'x3',
  }),
  {
    bottom: themeContract.spacing.x4,
    left: '50%',
    transform: 'translateX(-50%)',
  },
])

export const controlButton = style([
  sprinkles({
    cursor: 'pointer',
    display: 'flexRow',
    flexAlign: 'centerAll',
    aspectRatio: 'square',
    color: 'white',
    borderRadius: 'circle',
  }),
  iconClassess.root,
  {
    'background': 'rgba(50, 50, 50, 0.4)',
    'border': 'none',
    'width': '60px',

    ':hover': {
      background: 'rgba(50, 50, 50, 0.6)',
      transform: 'scale(1.1)',
    },
    ':active': {
      transform: 'scale(0.95)',
    },

    // TODO Vars or another util class for these
    'backdropFilter': 'blur(10px)',
    'transition': 'var(--tr-scale)',
    'fontSize': '2rem',
  },
])

export const controlButtonLarge = style([
  controlButton,
  {
    width: '100px',
    fontSize: '3rem',
  },
])
