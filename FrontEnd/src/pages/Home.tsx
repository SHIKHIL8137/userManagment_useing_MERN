import React from 'react'
import NavBar from '../components/NavBar/NavBar'
import { useSelector, UseSelector } from 'react-redux'
import { RootState } from '../redux/store'

const Home = () => {
const user = useSelector((state:RootState)=>state.auth.user)
  return (
<div className='flex justify-center items-center'>
<h1 className='text-white text-lg'>Hi {user?.name}</h1>
</div>
  )
}

export default Home
