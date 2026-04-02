import React from 'react'
import logo from '../../assets/logos/beathub.png' 
import logoSmall from '../../assets/logos/beathubSmall.png'
import {useNavigate} from 'react-router-dom'
const beatHubLogo = () => {
  const navigate = useNavigate()

  return (
    <picture className="cursor-pointer">
      <source media="(max-width: 767px)" srcSet={logoSmall} />
      <img
        src={logo}
        alt="BeatHub Logo"
        className="w-8 md:w-32 lg:w-40"
        onClick={() => navigate('/catalog')}
      />
    </picture>
  )
}

export default beatHubLogo