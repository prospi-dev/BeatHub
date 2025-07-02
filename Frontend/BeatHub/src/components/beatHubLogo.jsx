import React from 'react'
import logo from '../assets/logos/beathub.png' 
import {useNavigate} from 'react-router-dom'
const beatHubLogo = () => {
  const navigate = useNavigate()
  return (
    <img src={logo} alt="BeatHub Logo" className="w-20 md:w-35 lg:w-40" onClick={() => navigate('/')}/>)
}

export default beatHubLogo