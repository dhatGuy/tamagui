import { isWeb } from '@tamagui/constants'
import { createContext } from 'react'

import { getThemes } from '../config'
import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { getThemeUnwrapped } from '../hooks/getThemeUnwrapped'
import { ThemeParsed, ThemeProps } from '../types'
import { inverseTheme } from '../views/ThemeInverse'

type ThemeListener = (name: string | null, themeManager: ThemeManager) => void

export type SetActiveThemeProps = {
  className?: string
  parentManager?: ThemeManager | null
  name?: string | null
  theme?: any
  reset?: boolean
}

type ThemeManagerState = {
  name: string
  theme?: ThemeParsed | null
  className?: string
}

const emptyState: ThemeManagerState = { name: '-' }

export class ThemeManager {
  keys = new Map<any, Set<string>>()
  listeners = new Map<any, Function>()
  themeListeners = new Set<ThemeListener>()
  originalParentManager: ThemeManager | null = null
  parentManager: ThemeManager | null = null
  state: ThemeManagerState = emptyState

  constructor(
    public ogParentManager?: ThemeManager | 'root' | null | undefined,
    public props?: ThemeProps,
    public debug?: any
  ) {
    if (ogParentManager && ogParentManager !== 'root') {
      this.originalParentManager = ogParentManager
    }
    const didUpdate = this.update(props, true, false)
    if (ogParentManager === 'root') {
      return
    }
    this.parentManager = ogParentManager || null
    if (!didUpdate) {
      if (ogParentManager) {
        return ogParentManager
      }
    }
  }

  #allKeys: Set<string> | null = null
  get allKeys() {
    if (!this.#allKeys) {
      this.#allKeys = new Set([
        ...(this.originalParentManager?.allKeys || []),
        ...Object.keys(this.state.theme || {}),
      ])
    }
    return this.#allKeys
  }

  get didChangeTheme() {
    return this.originalParentManager && this.fullName !== this.originalParentManager.fullName
  }

  get parentName() {
    return this.parentManager?.state.name || null
  }

  get fullName(): string {
    return this.state?.name || this.props?.name || ''
  }

  // gets value going up to parents
  getValue(key: string) {
    let theme = this.state.theme
    let manager = this as ThemeManager | null
    while (theme && manager) {
      if (key in theme) {
        return theme[key]
      }
      manager = manager.parentManager
      theme = manager?.state.theme
    }
  }

  isTracking(uuid: Object) {
    return Boolean(this.keys.get(uuid)?.size)
  }

  update(props: ThemeProps & { forceTheme?: ThemeParsed } = {}, force = false, notify = true) {
    const shouldUpdate =
      !this.parentManager || (force ? false : this.getKey(props) === this.getKey())
    this.props = props
    if (props.forceTheme) {
      this.state.theme = props.forceTheme
      this.state.name = props.name || ''
      notify && this.notify()
      return true
    }
    if (shouldUpdate) {
      this.findNearestDifferingParentManager()
      const nextState = this.getState(props)
      if (nextState) {
        this.state = nextState
        notify && this.notify()
        return true
      }
    }
    return false
  }

  findNearestDifferingParentManager() {
    if (!this.originalParentManager || !this.props) return
    // find the nearest different parentManager
    const parent = this.originalParentManager
    const tries = 0
    // while (true) {
    //   if (++tries > 10) {
    //     throw new Error(`Nested 10 theme changes in a row`)
    //   }
    //   if (!parent || !parent.state.name) break
    //   if (parent.state.name === this.state.name) {
    //     if (parent.parentManager) {
    //       // go up if same
    //       parent = parent.parentManager
    //     }
    //   } else {
    //     this.parentManager = parent
    //     break
    //   }
    // }
  }

  #key: string | null = null

  getKey(props: ThemeProps | undefined = this.props) {
    if (!props) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`No props given to ThemeManager.getKey()`)
      }
      return ``
    }
    if (this.#key) return this.#key
    const key = `${props.name || 0}${props.inverse || 0}${props.reset || 0}${
      props.componentName || 0
    }`
    this.#key ??= key
    return key
  }

  getState(props: ThemeProps | undefined = this.props): ThemeManagerState | null {
    if (!props) {
      return null
    }
    const next = getNextThemeState(props, this.parentManager)
    if (!next || !next.theme) {
      return null
    }
    if (this.parentManager && next && next.theme === this.parentManager.state.theme) {
      return null
    }
    return next
  }

  getCN(name: string, disableRemoveScheme = false) {
    return getNextThemeClassName(name, disableRemoveScheme)
  }

  track(uuid: any, keys: Set<string>) {
    if (!this.state.name) return
    this.keys.set(uuid, keys)
  }

  notify() {
    if (!this.state.name) {
      this.keys.clear()
    }
    for (const [uuid, keys] of this.keys.entries()) {
      if (keys.size) {
        this.listeners.get(uuid)?.()
      }
    }
    this.themeListeners.forEach((cb) => cb(this.state.name, this))
  }

  onChangeTheme(cb: ThemeListener) {
    this.themeListeners.add(cb)
    return () => {
      this.themeListeners.delete(cb)
    }
  }
}

function getNextThemeClassName(name: string, disableRemoveScheme = false) {
  const next = `${THEME_CLASSNAME_PREFIX}${name} t_Theme`
  if (disableRemoveScheme) return next
  return next.replace('light_', '').replace('dark_', '')
}

function getNextThemeState(
  props: ThemeProps,
  parentManager?: ThemeManager | null
): ThemeManagerState | null {
  const themes = getThemes()

  if (props.reset && props.name) {
    return {
      name: props.name,
      theme: themes[props.name] as ThemeParsed,
      className: getNextThemeClassName(props.name),
    }
  }

  const parentName = parentManager?.state.name
  let nextName = parentManager?.props?.reset ? parentName || '' : props.name || ''
  if (props.inverse && !isWeb) {
    nextName = inverseTheme(nextName)
  }

  const potentialChild = `${parentName}_${nextName}`
  const potentialComponent = props.componentName
    ? `${withoutComponentName(nextName)}_${props.componentName}`
    : null

  // sort by most specific to least so we can bail early once we match one
  let potentials = [
    ...(potentialComponent ? [`${parentName}_${potentialComponent}`, potentialComponent] : []),
    potentialChild,
    nextName,
  ]
  if (props.inverse && !isWeb) {
    potentials = potentials.map(inverseTheme)
  }

  for (const name of potentials) {
    if (name in themes) {
      nextName = name
      break
    }
  }

  const theme = themes[nextName]

  return {
    name: nextName,
    theme: getThemeUnwrapped(theme),
    className: getNextThemeClassName(nextName, !!props.inverse),
  }
}

export const ThemeManagerContext = createContext<ThemeManager | null>(null)

const withoutComponentName = (name: string) => name.replace(/(_[A-Z][a-zA-Z]+)+$/g, '')
