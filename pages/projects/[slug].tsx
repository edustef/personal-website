import { useRouter } from 'next/dist/client/router'
import React from 'react'

export default function Project() {
  const { query } = useRouter()
  const slug = typeof query.slug === 'string' ? query.slug : query.slug[0]

  return <div>{slug}</div>
}
