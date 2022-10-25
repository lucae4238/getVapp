type ToastArgument = string |
{
  duration?: number,
  message: string,
  horizontalPosition?: 'left' | 'right'
  action?: {
    label: string,
    onClick?: () => void
    href?: string
    target?: string
  }
}
type ShowToast = (value: ToastArgument) => void;
type Handles<T extends ReadonlyArray<string>, V = string> = {
  [K in (T extends ReadonlyArray<infer U> ? U : never)]: V
};