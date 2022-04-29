import React, { useState } from 'react';
import { renderToString } from 'react-dom/server'
import { RepeatIcon } from '@chakra-ui/icons'

import ArtGenerator from './art_generator.js'



const Art = () => {

    const [value, setValue] = useState();

    const refresh = () => {
        // re-renders the component
        setValue({});
    }

    const showSVG = () => {
		let svg = renderToString(<ArtGenerator />)
		console.log(svg)
	}

  return (
    <div>
        <div className='flex flex-col justify-center items-center my-12'>
            <ArtGenerator />

            <button
            className='text-2xl font-bold pt-1 pb-2 px-3 mt-3 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
            onClick={ refresh }
            >
            <RepeatIcon  w={28} h={28}/>
            </button>

            <button
            className='text-2xl font-bold pt-1 pb-2 px-3 mt-3 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
            onClick={ showSVG }
            >
            SVG
            </button>
        </div>
    </div>
  )
}

export default Art