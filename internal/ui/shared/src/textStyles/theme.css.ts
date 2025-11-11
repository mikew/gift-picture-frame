import { style, styleVariants } from '@vanilla-extract/css'
import { createThemeContract, createTheme } from '@vanilla-extract/css'

// Theme contract (exported vars live in a .css.ts file as per vanilla-extract conventions)
export const vars = createThemeContract({
  colors: {
    loveGradientStart: null,
    loveGradientEnd: null,
    shoutBg: null,
    shoutText: null,
    memoryBg: null,
    dreamGradientStart: null,
    dreamGradientEnd: null,
    techBg: null,
    techText: null,
    celebrationBg: null,
    melancholyBg: null,
    whisperText: null,
    sarcasmBg: null,
    whimsyBg: null,
    normalText: null,
    classyText: null,
    loudText: null,
  },
  fonts: {
    serif: null,
    sans: null,
    script: null,
    mono: null,
    comic: null,
  },
  shadows: {
    soft: null,
  },
  sizes: {
    whisper: null,
    normal: null,
    shout: null,
  },
})

// Default theme values. You may override these by creating another theme with createTheme(vars, {...})
export const themeClass = createTheme(vars, {
  colors: {
    loveGradientStart: '#ff4d6d',
    loveGradientEnd: '#ff9bb3',
    shoutBg: '#ffb74d',
    shoutText: '#2b2b2b',
    memoryBg: '#f4e7d4',
    dreamGradientStart: '#b3ffec',
    dreamGradientEnd: '#ffd6f0',
    techBg: '#0b1220',
    techText: '#62d0ff',
    celebrationBg: 'linear-gradient(90deg, #ffd700, #ff8a00)',
    melancholyBg: '#2f5061',
    whisperText: 'inherit',
    sarcasmBg: '#efe6ff',
    whimsyBg: 'linear-gradient(45deg,#ffd1dc,#c2f0ff)',
    normalText: 'inherit',
    classyText: 'inherit',
    loudText: 'inherit',
  },
  fonts: {
    serif: 'Playfair Display, Georgia, serif',
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    script: '"Dancing Script", "Pacifico", cursive',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    comic: '"Comic Neue", "Comic Sans MS", sans-serif',
  },
  shadows: {
    soft: '0 6px 18px rgba(0,0,0,0.18)',
  },
  sizes: {
    whisper: '0.9em',
    normal: '1.05em',
    shout: '2em',
  },
})

// Base container used by all message styles
export const base = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1em 1.25em',
  // borderRadius: '12px',
  // // minWidth: '220px',
  // // maxWidth: '900px',
  // boxShadow: vars.shadows.soft,
  textAlign: 'center',
  lineHeight: 1.2,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  flexGrow: '1',
})

// Individual style classes
export const messageStyles = styleVariants({
  // existing from your UI
  normal: [
    base,
    style({
      fontFamily: vars.fonts.sans,
      fontSize: vars.sizes.normal,
      color: vars.colors.normalText,
      // background: 'transparent',
    }),
  ],

  classy: [
    base,
    style({
      fontFamily: vars.fonts.serif,
      fontStyle: 'italic',
      color: vars.colors.classyText,
      // background: 'transparent',
    }),
  ],

  loud: [
    base,
    style({
      fontFamily: vars.fonts.sans,
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      fontSize: vars.sizes.shout,
      color: vars.colors.loudText,
    }),
  ],

  // new styles
  love: [
    base,
    style({
      background: `linear-gradient(135deg, ${vars.colors.loveGradientStart}, ${vars.colors.loveGradientEnd})`,
      color: 'white',
      fontFamily: vars.fonts.script,
      fontStyle: 'italic',
      textShadow: '0 2px 8px rgba(0,0,0,0.28)',
    }),
  ],

  whisper: [
    base,
    style({
      fontFamily: vars.fonts.sans,
      fontSize: vars.sizes.whisper,
      color: vars.colors.whisperText,
      opacity: 0.85,
      filter: 'blur(0.2px)',
    }),
  ],

  shout: [
    base,
    style({
      background: vars.colors.shoutBg,
      color: vars.colors.shoutText,
      fontFamily: vars.fonts.sans,
      fontWeight: 900,
      textTransform: 'uppercase',
      fontSize: vars.sizes.shout,
      letterSpacing: '0.08em',
    }),
  ],

  memory: [
    base,
    style({
      background: vars.colors.memoryBg,
      color: 'rgba(20,20,20,0.9)',
      fontFamily: vars.fonts.serif,
      fontWeight: 300,
      filter: 'grayscale(0.05) saturate(0.9)',
    }),
  ],

  dream: [
    base,
    style({
      background: `linear-gradient(120deg, ${vars.colors.dreamGradientStart}, ${vars.colors.dreamGradientEnd})`,
      fontFamily: vars.fonts.script,
      color: '#111',
      animationName: '',
      // animations are best defined in a separate file or global style if you need keyframes
    }),
  ],

  tech: [
    base,
    style({
      background: vars.colors.techBg,
      color: vars.colors.techText,
      fontFamily: vars.fonts.mono,
      fontVariantNumeric: 'tabular-nums',
    }),
  ],

  sarcasm: [
    base,
    style({
      background: vars.colors.sarcasmBg,
      color: 'rgba(40,10,60,0.95)',
      fontFamily: vars.fonts.sans,
      fontStyle: 'oblique',
      transform: 'skewX(-6deg)',
    }),
  ],

  celebration: [
    base,
    style({
      background: vars.colors.celebrationBg,
      color: '#111',
      fontFamily: vars.fonts.sans,
      fontWeight: 700,
      // borderRadius: '14px',
      padding: '1.25em 1.5em',
    }),
  ],

  melancholy: [
    base,
    style({
      background: vars.colors.melancholyBg,
      color: 'rgba(255,255,255,0.88)',
      fontFamily: vars.fonts.serif,
      fontWeight: 300,
      opacity: 0.95,
    }),
  ],

  whimsy: [
    base,
    style({
      background: vars.colors.whimsyBg,
      color: '#111',
      fontFamily: vars.fonts.comic,
      transform: 'translateY(0)',
    }),
  ],
})

// Convenience exports
export type MessageStyle = keyof typeof messageStyles
export const allStyleNames = Object.keys(messageStyles) as MessageStyle[]
