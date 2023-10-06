import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Registration = () => {
  const urlParams = new useSearchParams()
  const router = useRouter()

  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!urlParams.get('id')) {
      return
    }
    const fetchData = async () => {
      const response = await fetch(`/api/proofEmail?id=${urlParams.get('id')}`)
      const { message } = await response.json()
      setMessage(message)
    }

    fetchData()
  }, [urlParams])

  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }, router)

  return (
    <>
      <Head>
        <title>av.by</title>
      </Head>
      <h1>{message}</h1>
    </>
  )
}

export default Registration
