import React, { forwardRef } from 'react'

import { ThemeName } from '../types'
import { Theme } from '../views/Theme'

export interface ThemeableProps {
  theme?: ThemeName | null
  themeInverse?: boolean
  componentName?: string
}

export function themeable<Component extends (props: any) => any>(
  component: Component,
  opts?: { componentName?: string }
) {
  const withThemeComponent = forwardRef(function WithTheme(props: ThemeableProps, ref) {
    const { themeInverse, theme, componentName, ...rest } = props
    const element = React.createElement(component, { ...rest, ref } as any)
    return (
      <Theme
        inverse={themeInverse}
        componentName={componentName || opts?.componentName}
        name={(theme as any) || null}
      >
        {element}
      </Theme>
    )
  })

  const withTheme: any = withThemeComponent
  withTheme.displayName = `Themed(${
    (component as any)?.displayName || (component as any)?.name || 'Anonymous'
  })`

  return withTheme as Component extends (props: infer P) => infer R
    ? (props: Omit<P, 'theme' | 'themeInverse'> & ThemeableProps) => R
    : unknown
}
