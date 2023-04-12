// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import {
  Account,
  ClipboardTextClock,
  EmailFastOutline,
  FrequentlyAskedQuestions,
  ChartBellCurve,
  CalculatorVariantOutline
} from 'mdi-material-ui'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },
    {
      title: 'Algorithms',
      icon: CalculatorVariantOutline,
      path: '/algorithms'
    },

    {
      title: 'Tasks',
      icon: ClipboardTextClock,
      path: '/tasks'
    },

    {
      title: 'Contact',
      icon: EmailFastOutline,
      path: '/contact'
    },

    {
      title: 'FAQ',
      icon: FrequentlyAskedQuestions,
      path: '/faq'
    },

    {
      sectionTitle: 'Admin Interface'
    },

    {
      title: 'User Managment',
      icon: Account,
      path: '/user-managment'
    },

    {
      title: 'Statistics',
      icon: ChartBellCurve,
      path: '/statistics'
    }
  ]
}

export default navigation
