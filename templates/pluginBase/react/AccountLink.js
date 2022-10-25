import { injectIntl } from 'react-intl'

const MyAppLink = ({ render, intl }) => {
  return render([
    {
      name: intl.formatMessage({ id: 'store/account.menu.link' }),
      path: '/my-app',
    }
  ])
}


export default injectIntl(MyAppLink)