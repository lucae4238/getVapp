import { canUseDOM } from 'vtex.render-runtime'

export function handleEvents(e: any) {
  switch (e.data.eventName) {
    case 'vtex:pageView': {
      break
    }

    default: {
      break
    }
  }
}

if (canUseDOM) {
  window.addEventListener('message', handleEvents)
}
