import { style } from '@vanilla-extract/css'
import { sprinkles } from 'shared/theme/sprinkles.css.js'

export const textarea = style([
  sprinkles({
    padding: 'x1',
    borderRadius: 'default',
    marginBottom: 'x1',
  }),
  {
    width: '100%',
    border: '1px solid #dee2e6',
    // fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
])

export const textPreview = style([
  // .text-preview {
  //   min-height: 150px;
  //   border-radius: 8px;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   text-align: center;
  //   padding: 2rem;
  //   margin-bottom: 2rem;
  //   border: 1px solid #dee2e6;
  // }
  sprinkles({
    display: 'flexColumn',
    borderRadius: 'default',
    marginBottom: 'x2',
    overflow: 'hidden',
  }),
  {
    minHeight: '150px',
    border: '1px solid #dee2e6',
  },
])
