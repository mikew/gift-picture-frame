import { style } from '@vanilla-extract/css'
import { themeContract } from 'shared/theme/contract.css.js'
import * as util from 'shared/theme/util.css.ts'

export const textarea = style([
  {
    width: '100%',
    padding: themeContract.spacing.x1,
    border: '1px solid #dee2e6',
    borderRadius: themeContract.radii.default,
    // fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    marginBottom: themeContract.spacing.x1,
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
  util.flexColumn,
  {
    minHeight: '150px',
    borderRadius: themeContract.radii.default,
    marginBottom: themeContract.spacing.x2,
    border: '1px solid #dee2e6',
    overflow: 'hidden',
  },
])
