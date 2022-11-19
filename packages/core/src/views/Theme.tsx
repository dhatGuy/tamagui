import { isWeb } from '@tamagui/constants'
import { memo, useMemo } from 'react'

import { variableToString } from '../createVariable'
import { ThemeManager, ThemeManagerContext } from '../helpers/ThemeManager'
import { useChangeThemeEffect } from '../hooks/useTheme'
import { ThemeProps } from '../types'

export const Theme = memo(function Theme(props: ThemeProps) {
  const { name, theme, themeManager, themes, className } = useChangeThemeEffect(props)

  const missingTheme = !themes || !name || !theme

  // memo here, changing theme without re-rendering all children is a critical optimization
  // may require some effort of end user to memoize but without this memo they'd have no option
  let contents = useMemo(
    () => (missingTheme ? null : wrapThemeManagerContext(props.children, themeManager)),
    [missingTheme, props.children, themeManager]
  )

  if (missingTheme) {
    if (name && !theme && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(`No theme found by name ${name}`)
    }
    return props.children
  }

  if (isWeb) {
    const classNameFinal = (
      !props.disableThemeClass
        ? [props.className, className, '_dsp_contents'].filter(Boolean)
        : ['_dsp_contents']
    ).join(' ')

    contents = (
      <span
        className={classNameFinal}
        style={{
          // in order to provide currentColor, set color by default
          color: variableToString(themes[name]?.color),
        }}
      >
        {contents}
      </span>
    )

    // web relies on nesting .t_dark > .t_blue to avoid generating as many selectors
    if (props.inverse) {
      const isDark = name.startsWith('dark_')
      contents = (
        <div className={`t_themeinverse _dsp_contents ${isDark ? 't_light' : 't_dark'}`}>
          {contents}
        </div>
      )
    }
  }

  return contents
})

export function wrapThemeManagerContext(
  children: any,
  themeManager?: ThemeManager | null,
  shouldSetChildrenThemeToParent?: boolean
) {
  return themeManager ? (
    <ThemeManagerContext.Provider value={themeManager}>
      {shouldSetChildrenThemeToParent ? (
        <Theme name={themeManager.parentName}>{children}</Theme>
      ) : (
        children
      )}
    </ThemeManagerContext.Provider>
  ) : (
    children
  )
}
