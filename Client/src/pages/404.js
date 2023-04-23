import { useRouter } from 'next/router'
import { useEffect } from 'react'

const ErrorRoute = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('/')
  }, [])
  return null
}

export default ErrorRoute
