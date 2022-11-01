import React, { useEffect } from 'react'

const IconList = () => {
    const ICON_DATA = [
        {
            name: "きのこ",
            ext: 'JPEG',
            classname: "icon_mushroom"
        },
        {
            name: "りんご",
            ext: 'PNG',
            classname: "icon_apple"
        },
        {
            name: "マグカップ",
            ext: 'SVG',
            classname: "icon_cup"
        }
    ]

    return (
        <>
            <ul className={'iconList'}>
                {ICON_DATA.map((item, index ) => {
                    return (
                        <li key={index}>
                            <p className={item.classname}></p>
                            <p>{item.name}</p>
                            <p>{item.ext}</p>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default IconList