import React from 'react'

const Showdown = ({player, opponent}) => {
  return (
    <div className="game showdown__container">
      <div className="game showdown__top">
          {player.username}
      </div>
      <div className="game showdown__versus">
        VS
      </div>
      <div className="game showdown__bottom">
          {opponent.username}
      </div>
    </div>
)
}

export default Showdown
