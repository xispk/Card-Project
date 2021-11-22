import React from 'react'

const Popup = ({ popupText }) => {
  return (
    <div className="game popup__banner">
      <h2 className="game popup__banner-text">{popupText}</h2>
    </div>
  )
}

export default Popup
