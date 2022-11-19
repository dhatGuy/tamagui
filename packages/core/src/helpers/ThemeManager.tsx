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

const emptyState: ThemeManagerState = { name: '' }

export class ThemeManager {
  keys = new Map<any, Set<string>>()
  listeners = new Map<any, Function>()
  themeListeners = new Set<ThemeListener>()
  theme: ThemeParsed | null = null
  parentManager: ThemeManager | null = null
  state: ThemeManagerState = emptyState

  constructor(public originalParentManager?: ThemeManager | undefined, public props?: ThemeProps) {
    this.parentManager = originalParentManager || null
    this.update(props)
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
    let theme = this.theme
    let manager = this as ThemeManager | null
    while (true) {
      if (!theme) return
      if (key in theme) {
        return theme[key]
      }
      if (this.parentManager) {
        manager = this.parentManager
        if (!manager) return
        theme = manager.theme
      }
    }
  }

  isTracking(uuid: Object) {
    return Boolean(this.keys.get(uuid)?.size)
  }

  update(props: ThemeProps & { forceTheme?: ThemeParsed } = {}, force = false, notify = true) {
    const avoidUpdate = force && this.getKey(props) === this.getKey()
    this.props = props
    if (props.forceTheme) {
      this.theme = props.forceTheme
      this.state.name = props.name || ''
      notify && this.notify()
      return true
    } else if (!avoidUpdate) {
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
    let parent = this.originalParentManager
    let tries = 0
    while (true) {
      if (++tries > 10) {
        throw new Error(`Nested 10 theme changes in a row`)
      }
      if (!parent || !parent.state.name) break
      if (parent.state.name === this.state.name) {
        if (parent.parentManager) {
          // go up if same
          parent = parent.parentManager
        }
      } else {
        this.parentManager = parent
        break
      }
    }
  }

  getKey(props: ThemeProps | undefined = this.props) {
    if (!props) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`No props given to ThemeManager.getKey()`)
      }
      return ``
    }
    return `${props.name}${props.inverse}${props.reset}${props.componentName}`
  }

  getState(props: ThemeProps | undefined = this.props): ThemeManagerState | null {
    if (!props) {
      return null
    }

    const themes = getThemes()
    const { name, componentName } = props

    if (props.reset && name) {
      return {
        name: name,
        theme: themes[name] as ThemeParsed,
        className: this.getCN(name),
      }
    }

    const parentIsReset = this.parentManager?.props?.reset

    if (!name) {
      if (componentName) {
        // allow for _Card_Button or just _Button
        let names = [
          `${this.state.name}_${componentName}`,
          `${withoutComponentName(this.state.name)}_${componentName}`,
        ]
        if (props.inverse && !isWeb) {
          names = names.map((name) => inverseTheme(name))
        }
        for (const name of names) {
          if (name in themes) {
            const className = this.getCN(name)
            return { name, theme: themes[name], className }
          }
        }
      }
      if (props.inverse && !isWeb) {
        const name = inverseTheme(props.name || this.state.name)
        if (!(name in themes)) {
          throw new Error(`No theme inverse found`)
        }
        return {
          name,
          className: this.getCN(name, true),
          theme: themes[name],
        }
      }
      return this.state
    }

    let nextName = parentIsReset ? this.parentName || '' : name || this.state.name || ''
    if (props.inverse && !isWeb) {
      nextName = inverseTheme(nextName)
    }

    if (this.parentName) {
      const subName = `${this.parentName}_${nextName}`
      if (subName in themes) {
        nextName = subName
      }
    }

    // let parentName = this.parentName || this.fullName
    // console.log('starts with', { parentName, nextName })
    // if (!parentIsReset) {
    //   while (true) {
    //     // if (nextName in themes) break
    //     nextName = `${parentName}_${name}`
    //     if (nextName in themes) break
    //     // this is fine - some themes can not have parents
    //     if (!parentName.includes(THEME_NAME_SEPARATOR)) break
    //     // go up one
    //     parentName = parentName.slice(0, parentName.lastIndexOf(THEME_NAME_SEPARATOR))
    //   }
    // }

    if (componentName) {
      // allow for _Card_Button or just _Button
      let names = [
        `${nextName}_${componentName}`,
        `${withoutComponentName(nextName)}_${componentName}`,
      ]
      if (props.inverse && !isWeb) {
        names = names.map((name) => inverseTheme(name))
      }
      // console.log('getin', names)
      for (const name of names) {
        if (name in themes) {
          nextName = name
        }
      }
    }

    // console.log('gots', { nextName, parent: this.parentManager?.name })

    let theme = themes[nextName]
    if (!theme) {
      theme = themes[`light_${nextName}`]
    }

    return {
      name: nextName,
      theme: getThemeUnwrapped(theme),
      className: this.getCN(nextName, !!props.inverse),
    }
  }

  getCN(name: string, disableRemoveScheme = false) {
    const next = `${THEME_CLASSNAME_PREFIX}${name} t_Theme`
    if (disableRemoveScheme) return next
    return next.replace('light_', '').replace('dark_', '')
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

export const ThemeManagerContext = createContext<ThemeManager | null>(null)

const withoutComponentName = (name: string) => name.replace(/(_[A-Z][a-zA-Z]+)+$/g, '')
