import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server'
import { RefreshIcon } from '@heroicons/react/solid'

import ArtGenerator from './ArtGenerator.js'



const Art = (props) => {
    
  const [answer, setAnswer] = useState("");
  const [key, setKey] = useState(1);

  const refresh = () => {
    setKey(++key)
  }

  const showSVG = () => {
    let element = document.getElementById('div').innerHTML
    console.log(element)
	}

  const updateSvg = (e) => {
    setAnswer(e.target.value)
    setKey(++key)
  }

  return (
    <div>
      <div className='flex flex-col justify-center items-center my-12 text-[#6a50aa]'>
        
        <div className="text-lg font-bold">
          What word(s) best describe art for you?
        </div>

        <div className="mt-1">
          <input
            id="answer"
            name="answer"
            type="text"
            onChange={ updateSvg }
            value={ answer }
            className="px-3 py-2 my-2 border-2 border-[#f1c232] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#6a50aa] focus:border-[#6a50aa] sm:text-sm"
          />
        </div>

        <div className="mt-5 text-lg font-bold">
          Tell us your name
        </div>

        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            className="px-3 py-2 my-2 border-2 border-[#f1c232] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#6a50aa] focus:border-[#6a50aa] sm:text-sm"
          />
        </div>

        <div id='div' className='mt-5'>
          <ArtGenerator id='svgId' key={ key } answer={ answer } />
        </div>
        
        <button
          className='text-2xl font-bold p-2 mt-3 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
          onClick={ refresh }
        >
          <RefreshIcon className="h-5 w-5 "/>
        </button>

      </div>
    </div>
  )
}

export default Art