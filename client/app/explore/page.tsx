'use client'

import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'

const Selection = () => {
  const [repositories, setRepositories] = useState([])
  useEffect(() => {
    axios.get('http://localhost:3000/alldocs').then((response) => {
      console.log(response.data)
      setRepositories(response.data)
    })
  }, [])

  const router = useRouter()
  const onClick = (id: string) => {
    router.push(`/explore/${id}`)
  }

  return (
    <div>
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 border border-gray-300 rounded-md shadow-sm">Box 1</div>
        <div class="p-4 border border-gray-300 rounded-md shadow-sm">Box 2</div>
        <div class="p-4 border border-gray-300 rounded-md shadow-sm">Box 3</div>
        <div class="p-4 border border-gray-300 rounded-md shadow-sm">Box 4</div>
        <div class="p-4 border border-gray-300 rounded-md shadow-sm">Box 5</div>
        <div class="p-4 border border-gray-300 rounded-md shadow-sm">Box 6</div>
      </div>
    </div>
  )
}

export default Selection
