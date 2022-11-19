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
    const manager = new ThemeManager(undefined, {
      name: 'dark',
    })
    expect(manager.state.name).toBe('dark')
  })

  test('Given parent theme "dark" and child theme "red" to return theme "dark_red"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'dark',
    })
    const child = new ThemeManager(parent, {
      name: 'red',
    })
    expect(parent.state.name).toBe('dark')
    expect(child.state.name).toBe('dark_red')
  })

  test.only('Given parent theme "dark", child theme "blue_alt2" and component "Button" returns "dark_blue_alt2_Button"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'dark',
    })
    const child1 = new ThemeManager(parent, {
      name: 'blue',
    })
    expect(child1.state.name).toBe('dark_blue')
    const child2 = new ThemeManager(child1, {
      name: 'alt2',
      componentName: 'Button',
    })
    expect(child2.state.name).toBe('dark_blue_alt2_Button')
  })

  test('Inverts "light" to "dark"', () => {
    const parent = new ThemeManager(undefined, {
      name: 'light',
    })
    const child = new ThemeManager(parent, {
      name: 'dark',
    })
    expect(parent.state.name).toBe('light')
    expect(child.state.name).toBe('dark')
  })
})
