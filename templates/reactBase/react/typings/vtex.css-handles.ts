declare module 'vtex.css-handles'

export const useCssHandles = (cssHandles: string[]): Handles<typeof cssHandles> => {
  const handles: any = {}
  cssHandles.forEach(handle => {
    handles[handle] = handle
  })

  return handles
}
