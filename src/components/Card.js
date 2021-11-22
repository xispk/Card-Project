import { useContext } from 'react';
import { GlobalStates } from '../contexts/GlobalStates';


import { 
  GiWizardStaff, 
  GiBroadsword, 
  GiBookAura, 
  GiWolfTrap } from 'react-icons/gi';

import { RiSwordFill, RiShieldFill } from 'react-icons/ri';

import { 
  AirSvg, 
  FireSvg, 
  WaterSvg,
  EarthSvg,
  IceSvg,
  DarkSvg,
  LightSvg,
  NatureSvg,
  LightningSvg } from './Elements.js';


const selectCategory = (category) => {
  const categories = {
    normal: < GiBroadsword />,
    effect: < GiBookAura />,
    magic: < GiWizardStaff />,
    trap: < GiWolfTrap />
  }

  return categories[category];
};

const selectElement = (element) => {
  const elements = {
    air: <AirSvg />,
    water: <WaterSvg />,
    earth: <EarthSvg />,
    ice: <IceSvg />,
    dark: <DarkSvg />,
    light: <LightSvg />,
    nature: <NatureSvg />,
    lightning: <LightningSvg />,
    fire: <FireSvg />
  }

  return elements[element];
};

// const selectElementTextPTBR = (element) => {
//   const elementsTexts = {
//     air: "Vento",
//     water: "Água",
//     earth: "Terra",
//     ice: "Gelo",
//     dark: "Escuridão",
//     light: "Luz",
//     nature: "Natureza",
//     lightning: "Trovão",
//     fire: "Fogo"
//   }

//   return elementsTexts[element];
// };

// const selectCategoryTextPTBR = (category) => {
//   const categoryTexts = {
//     effect: "Efeito",
//     normal: "Normal",
//     magic: "Mágica",
//     trap: "Armadilha"
//   }

//   return categoryTexts[category];
// };

const selectStance = (stance) => {
  const stances = {
    defensive: <RiShieldFill />,
    offensive: <RiSwordFill />
  }

  return stances[stance];
}


const Card = ({ card, isMyTurn, handleCardSelection }) => {
  const { userInfo, gameInfo } = useContext(GlobalStates);
  const { 
    _id, 
    name,
    category,
    variation,
    atk, 
    def,
    element,
    stance, 
    version, 
    isFlipped, 
    isVisible,
    user,
    owner } = card;
  
  if ( (category === "normal" || category === "effect")  
    && version === "preview" ) {
    return ( 
      <div 
        key={`preview${_id}`}
        onClick={() => isMyTurn && gameInfo.phase === "positioning" 
          && handleCardSelection(card)}
        className={ isMyTurn && gameInfo.phase === "positioning" ? 
        "fighter card-container preview hoverable" 
        : 
        "fighter card-container preview"}>
        <>
          <div className="card__front">
            <div className="card__name">{name}</div>
            <div className="card__image">{`Imagem da ${name}`}</div>
            <div className="card__description">{`Descrição da ${name}`}</div>
            <div className="card__bottom">
              <div className="card__types">
                <div className="card__element-holder">
                  <div className={`card__element-icon ${element}`}>
                    {selectElement(element)}
                  </div>
                </div>
                <div className="card__category-icon">
                  {selectCategory(category)}
                </div>
              </div>
              <div className="card__stats">
                <div className="card__attack-holder">
                  <div className="card__attack-icon"><RiSwordFill /></div>
                  <div className="card__attack">{atk}</div>
                </div>
                <div className="card__defense-holder">
                  <div className="card__defense-icon"><RiShieldFill /></div>
                  <div className="card__defense">{def}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    );
  } else if ( (category !== "normal" || category !== "effect") 
  && version === "preview" ) {
    return ( 
      <div 
        key={`${_id}preview`} 
        className="magic card-container preview">
        <>
          <div className="card__front">
            <div className="card__name">{name}</div>
            <div className="card__image">{`Imagem da ${name}`}</div>
            <div className="card__description">{`Descrição da ${name}`}</div>
            <div className="card__types">
              <div className="card__category">{category}</div>
              <div className="card__variation">{variation}</div>
            </div>
          </div>
        </>
      </div> 
    );
  }

  if ( (category === "normal" || category === "effect")  
  && version === "token" ) {
    return ( 
      <div 
        key={_id} 
        className={ isFlipped ? 
          "fighter card-container token" 
          : 
          "fighter card-container token flipped"
        }>
        { !isVisible && String(user) !== String(userInfo._id) ? 
        <div className="card__back">
          <div className="card__back-icon">?</div>
        </div>
        :
        <>
          <div className="card__front">
            <div className="card__image">{`Imagem da ${name}`}</div>
            <div className="card__types">
              <div 
                className={`card__element-icon ${element}`}>
                {selectElement(element)}
              </div>
              <div className="card__category">{selectCategory(category)}</div>
            </div>
            <div className="card__stats">
              <div className="card__attack"><span>ATK:</span><h1>{atk}</h1></div>
              <div className="card__defense"><span>DEF:</span><h1>{def}</h1></div>
            </div>
            {stance !== "none" &&
              <div className="card__stance">{selectStance(stance)}</div>
            }
          </div>
          {/* <div className="card__back"></div> */}
        </>
        }
      </div>
    );
  } else if ( (category !== "normal" || category !== "effect") 
    && version === "token" ) {
    return ( 
      <div 
        key={_id} 
        className={ isFlipped ? 
          "magic card-container token" 
          : 
          "magic card-container token flipped"
        }>
        { !isVisible && String(user) !== String(userInfo._id) ? 
        <div className="card__back"></div>
        :
        <>
          <div className="card__front">
            <div className="card__image">{`Imagem da ${name}`}</div>
            <div className="card__types">
              <div className="card__category">{category}</div>
              <div className="card__variation">{variation}</div>
            </div>
          </div>
          {/* <div className="card__back"></div> */}
        </>
        }
      </div> 
    );
  }
}
 
export default Card;