import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import { beforeAll, describe, expect, test } from 'vitest'

import { createTamagui } from '../createTamagui'
import { ThemeManager } from './ThemeManager'

describe('ThemeManager', () => {
  beforeAll(() => {
    const conf = getDefaultTamaguiConfig()
    createTamagui(conf)
  })

  test('Changes theme to dark', () => {
    const manager = new ThemeManager()
    const next = manager.getNextTheme({
      name: 'dark',
    })
    expect(next.name).toBe('dark')
  })

  test('Given parent theme "dark" and child theme "red" to return theme "dark_red"', () => {
    const parent = new ThemeManager({
      name: 'dark',
    })
    const child = new ThemeManager(undefined, parent)
    const next = child.getNextTheme({
      name: 'red',
    })
    expect(next.name).toBe('dark_red')
  })

  test('Inverts "light" to "dark"', () => {
    const parent = new ThemeManager({
      name: 'dark',
    })
    const child = new ThemeManager(undefined, parent)
    const next = child.getNextTheme({
      inverse: true,
    })
    expect(next.name).toBe('light')
  })
})
