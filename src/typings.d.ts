declare module '*.scss' {
    const styles: { [className: string]: string }
    export default styles
}

interface ResponsiveImage {
    srcSet: string
    src: string
    placeholder?: string
    width: number
    height: number
    toString: () => string
    images: { path: string; width: number; height: number }[]
}

declare module '*.jpg' {
    const content: ResponsiveImage
    export default content
}

declare module '*.svg' {
    const value: string
    export default value
}
