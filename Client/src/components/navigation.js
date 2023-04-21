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

// ** React imports
import { useState, useEffect } from 'react'
import api from './api'

const navigation = () => {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(async () => {
    return await api
      .post('/check_permissions/' , {"user_id": "Admin@gmail.com"})   // TODO: Change the user_id to the logged-in user
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          setIsAdmin(res.data.is_admin)
          setIsAdmin(true)  // TODO: Remove this when admin managing is ready in the system
        }
      })
      .catch(err => console.log(err))
  }, [])

  if(isAdmin)
  {
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
  else 
  {
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
      }
    ]
  }
}

export default navigation
