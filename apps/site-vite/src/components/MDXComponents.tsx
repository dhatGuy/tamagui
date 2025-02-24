import { Link } from '@tamagui/lucide-icons'
import NextLink from 'next/link'
import NextRouter from 'next/router'
import rangeParser from 'parse-numeric-range'
import React from 'react'
import { ScrollView } from 'react-native'
import {
  Button,
  H1,
  H2,
  H3,
  H4,
  H5,
  Image,
  ImageProps,
  Paragraph,
  Separator,
  Spacer,
  Text,
  Theme,
  XGroup,
  XStack,
  XStackProps,
  YStack,
} from 'tamagui'
import { styled } from 'tamagui'

import { BenchmarkChart } from './BenchmarkChart.client'
import { Code, CodeInline } from './code/Code'
import { DocCodeBlock } from './code/DocsCodeBlock.client'
import { Highlights } from './Highlights.server'
import { ExampleAnimations } from './home/HeroAnimations.client'
import { MediaPlayer } from './home/MediaPlayer'
import { ExternalIcon } from './icons/ExternalIcon.server'
import { HR } from './views/HR.server'
import { LI } from './views/LI.server'
import { Notice } from './views/Notice'

export const OffsetBox = styled(YStack, {
  name: 'OffsetBox',
  variants: {
    size: {
      hero: {
        $gtSm: { mx: '$-2' },
        $gtMd: { mx: '$-4' },
        $gtLg: { mx: '$-6' },
      },
    },
  } as const,
})

// import { PropsTable } from
// import { SubTitle } from
// import { UL } from

// export { AddThemeDemo, AlertDialogDemo, AnimationsDemo, AnimationsEnterDemo, AnimationsHoverDemo, AnimationsPresenceDemo, AvatarDemo, ButtonDemo, CardDemo, DialogDemo, FeatherIconsDemo, FormsDemo, GroupDemo, HeadingsDemo, ImageDemo, LabelDemo, LinearGradientDemo, ListItemDemo, PopoverDemo, ProgressDemo, SelectDemo, SeparatorDemo, ShapesDemo, SheetDemo, SliderDemo, SpinnerDemo, StacksDemo, SwitchDemo, TextDemo, ThemeInverseDemo, TooltipDemo, UpdateThemeDemo } from '@tamagui/demos'

export const components = {
  Spacer,
  ExampleAnimations,
  ScrollView,
  Text,
  Paragraph,
  OffsetBox,
  YStack,
  XStack,
  BenchmarkChart,
  Separator,
  Code,
  HeroContainer,

  ...Demos,

  Highlights,
  PropsTable,
  Description: SubTitle,
  UL,
  LI,

  DeployToVercel: () => {
    return (
      <a
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftamagui%2Fstarters&root-directory=next-expo-solito/next&envDescription=Set%20this%20environment%20variable%20to%201%20for%20Turborepo%20to%20cache%20your%20node_modules.&envLink=https%3A%2F%2Ftamagui.dev&project-name=tamagui-app&repo-name=tamagui-app&demo-title=Tamagui%20App%20%E2%9A%A1%EF%B8%8F&demo-description=Tamagui%20React%20Native%20%2B%20Next.js%20starter&demo-url=https%3A%2F%2Ftamagui.dev%2Fstarter&demo-image=https%3A%2F%2Ftamagui.dev%2Fblog%2Fintroducing-tamagui%2Fhero.png"
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="Deploy with Vercel"
          style={{ height: 32, width: 90 }}
          src="https://vercel.com/button"
        />
      </a>
    )
  },

  Beta: () => (
    <Button
      accessibilityLabel="Beta blog post"
      pe="none"
      size="$2"
      theme="pink_alt2"
      pos="absolute"
      t={-15}
      r={-75}
      rotate="5deg"
    >
      Beta
    </Button>
  ),

  IntroParagraph: ({ children, ...props }) => {
    return (
      <Paragraph tag="span" size="$5" className="paragraph" display="block" mt="$1" {...props}>
        {children}
      </Paragraph>
    )
  },

  Note: (props) => (
    <YStack
      tag="aside"
      mt="$5"
      mb="$5"
      borderRadius="$3"
      // & & p
      // fontSize: '$3',
      // color: '$slate11',
      // lineHeight: '23px',
      // margin: 0,
      {...props}
    />
  ),

  Notice,

  h1: (props) => <H1 width="max-content" pos="relative" mb="$2" {...props} />,

  h2: ({ children, ...props }) => (
    <H2
      pos="relative"
      width={`fit-content` as any}
      mt="$5"
      size="$9"
      letterSpacing={-0.5}
      data-heading
      {...props}
    >
      {children}
    </H2>
  ),

  h3: ({ children, id, ...props }) => (
    <LinkHeading mt="$5" mb="$1" id={id}>
      <H3
        pos="relative"
        width={`fit-content` as any}
        nativeID={id}
        size="$8"
        data-heading
        {...props}
      >
        {children}
      </H3>
      {getNonTextChildren(children)}
    </LinkHeading>
  ),

  h4: (props) => <H4 pos="relative" width={`fit-content` as any} mt="$6" {...props} />,
  h5: (props) => <H5 mt="$5" {...props} />,

  p: (props) => (
    <Paragraph className="docs-paragraph" display="block" my="$3" size="$5" {...props} />
  ),

  a: ({ href = '', children, ...props }) => {
    return (
      <NextLink legacyBehavior href={href} passHref>
        {/* @ts-ignore */}
        <Paragraph fontSize="inherit" tag="a" display="inline" cursor="pointer" {...props}>
          {children}
          {href.startsWith('http') ? (
            <>
              &nbsp;
              <Text fontSize="inherit" display="inline-flex" y={2} mr={2}>
                <ExternalIcon />
              </Text>
            </>
          ) : null}
        </Paragraph>
      </NextLink>
    )
  },

  hr: HR,

  ul: ({ children }) => {
    return (
      <UL>{React.Children.toArray(children).map((x) => (typeof x === 'string' ? null : x))}</UL>
    )
  },

  ol: (props) => <YStack {...props} tag="ol" mb="$3" />,

  li: (props) => {
    return (
      <LI>
        <Paragraph size="$5" tag="span">
          {props.children}
        </Paragraph>
      </LI>
    )
  },

  strong: (props) => <Paragraph tag="strong" fontSize="inherit" {...props} fontWeight="700" />,

  img: ({ ...props }) => (
    <YStack my="$6">
      {/* TODO make this a proper <Image /> component */}
      <YStack tag="img" {...props} maxWidth="100%" />
    </YStack>
  ),

  pre: ({ children }) => <>{children}</>,

  code: (props) => {
    const {
      hero,
      line,
      scrollable,
      className,
      children,
      id,
      showLineNumbers,
      collapsible,
      ...rest
    } = props
    if (!className) {
      return <CodeInline>{children}</CodeInline>
    }
    return (
      <YStack mt="$3">
        <DocCodeBlock
          isHighlightingLines={line !== undefined}
          className={className}
          isHero={hero !== undefined}
          isCollapsible={hero !== undefined || collapsible !== undefined}
          isScrollable={scrollable !== undefined}
          showLineNumbers={showLineNumbers !== undefined}
          {...rest}
        >
          {children}
        </DocCodeBlock>
      </YStack>
    )
  },

  Image: ({ children, size, ...props }: ImageProps & { size?: 'hero' }) => (
    <OffsetBox size={size} tag="figure" f={1} mx={0} mb="$3" ai="center" jc="center" ov="hidden">
      <Image maxWidth="100%" {...props} />
      <Text tag="figcaption" lineHeight={23} color="$colorPress" mt="$2">
        {children}
      </Text>
    </OffsetBox>
  ),

  Video: ({
    small,
    large,
    src,
    children = '',
    muted = true,
    autoPlay = true,
    controls,
    size,
    ...props
  }) => (
    <YStack tag="figure" mx={0} my="$6">
      <OffsetBox size={size}>
        <video
          src={src}
          autoPlay={autoPlay}
          playsInline
          muted={muted}
          controls={controls}
          loop
          style={{ width: '100%', display: 'block' }}
        ></video>
      </OffsetBox>
      <Text tag="figcaption" lineHeight={23} mt="$2" color="$colorPress">
        {children}
      </Text>
    </YStack>
  ),

  blockquote: ({ children, ...props }) => {
    return (
      <YStack
        my="$4"
        pl="$4"
        ml="$3"
        borderLeftWidth={1}
        borderColor="$borderColor"
        jc="center"
        {...props}
      >
        <Paragraph whiteSpace="revert" size="$4" color="$color" opacity={0.65}>
          {/* @ts-ignore */}
          {React.Children.toArray(children).map((x) => (x?.props?.children ? x.props.children : x))}
        </Paragraph>
      </YStack>
    )
  },

  Preview: (props) => {
    return <Preview {...props} mt="$5" />
  },

  RegisterLink: ({ id, index, href }) => {
    const isExternal = href.startsWith('http')

    React.useEffect(() => {
      const codeBlock = document.getElementById(id)
      if (!codeBlock) return

      const allHighlightWords = codeBlock.querySelectorAll('.highlight-word')
      const target = allHighlightWords[index - 1]
      if (!target) return

      const addClass = () => target.classList.add('on')
      const removeClass = () => target.classList.remove('on')
      const addClick = () => (isExternal ? window.location.replace(href) : NextRouter.push(href))

      target.addEventListener('mouseenter', addClass)
      target.addEventListener('mouseleave', removeClass)
      target.addEventListener('click', addClick)

      return () => {
        target.removeEventListener('mouseenter', addClass)
        target.removeEventListener('mouseleave', removeClass)
        target.removeEventListener('click', addClick)
      }
    }, [])

    return null
  },

  H: ({ id, index, ...props }) => {
    const triggerRef = React.useRef<HTMLElement>(null)

    React.useEffect(() => {
      const trigger = triggerRef.current

      const codeBlock = document.getElementById(id)
      if (!codeBlock) return

      const allHighlightWords = codeBlock.querySelectorAll('.highlight-word')
      const targetIndex = rangeParser(index).map((i) => i - 1)
      // exit if the `index` passed is bigger than the total number of highlighted words
      if (Math.max(...targetIndex) >= allHighlightWords.length) return

      const addClass = () => targetIndex.forEach((i) => allHighlightWords[i].classList.add('on'))
      const removeClass = () =>
        targetIndex.forEach((i) => allHighlightWords[i].classList.remove('on'))

      trigger?.addEventListener('mouseenter', addClass)
      trigger?.addEventListener('mouseleave', removeClass)

      return () => {
        trigger?.removeEventListener('mouseenter', addClass)
        trigger?.removeEventListener('mouseleave', removeClass)
      }
    }, [])

    return <Paragraph fontFamily="$mono" cursor="default" ref={triggerRef} {...props} />
  },

  MediaPlayerDemo: ({ theme, ...props }) => {
    return (
      <Theme name={theme}>
        <MediaPlayer {...props} />
      </Theme>
    )
  },

  GroupDisabledDemo: () => {
    return (
      <XGroup als="center" disabled>
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </XGroup>
    )
  },

  DemoButton: () => <Button>Hello world</Button>,
}

const LinkHeading = ({ id, children, ...props }: { id: string } & XStackProps) => (
  <XStack
    tag="a"
    href={`#${id}`}
    id={id}
    data-id={id}
    display="inline-flex"
    ai="center"
    space
    {...props}
  >
    {children}
    <YStack tag="span" opacity={0.3}>
      <Link size={12} color="var(--color)" aria-hidden />
    </YStack>
  </XStack>
)

const getNonTextChildren = (children) =>
  React.Children.map(children, (x) => (typeof x !== 'string' ? x : null)).flat()
