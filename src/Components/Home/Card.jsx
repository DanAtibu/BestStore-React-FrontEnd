

import React from 'react';
import "./Card.css";



export default function Card({title, value, icon, borderColor}) {

    const style = {
        borderWidth: "0.4rem",
        borderStyle: "solid",
        borderColor: `rgba(${borderColor}, 0.2)`,
    }


  return (
    <div className='home_card_info flex'>
        <div className='home_card_info_icon flex' style={style}>
            <i className={icon} style={{color: `rgba(${borderColor})`}}></i>
        </div>
        <div className='home_card_info_detail'>
            <p className='home_card_info_detail_title'>{title}</p>
            <p className='home_card_info_detail_value'>{value}</p>
        </div>
    </div>
  )
}

Card.defaultProps = {
    title: "----",
    icon: "fas fa-user",
    value: "----",
    borderColor: "26, 125, 238"
}


