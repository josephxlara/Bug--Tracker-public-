// General Imports
import React from 'react';

// SVG Imports
import Bug from '../SVGs/Bug--Tracker1.svg'

export default function LoadingPage() {
    return (
        <div className='loadingDiv'>
            <img src={Bug} alt='bugLogo' className='loadingBug' />
        </div>
    )
}