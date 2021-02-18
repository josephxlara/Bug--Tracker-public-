// General Imports
import React, { useState, useContext, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';

// Component Imports
import LoadingPage from './LoadingPage';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context';

// SVG Imports
import Bug from '../SVGs/Bug--TrackerLogo(bug).svg';


export default function ProfilePage() {
    /**
     * * State constants from context provider:
     * * currentUser --> main purpose: a prop that is used to initialize the whole project to the current user's info/data
     * * updatePassowrd --> main purpose: update user's password (method from firebase auth)
     */
    const { currentUser } = useContext(bugTrackerPropProvider);

    // Constant used to push user back to dashboard upon submission of new project form

    /**
     * * Component's state constants
     */


    return (
        <div className='profilePageDiv' >
            <div className='headerDiv'>
                <Link to='/dashboard' ><img className='bug' style={{top: '2px'}} src={Bug} alt='bug' /></Link>
                <h2>{currentUser.email}</h2>
            </div>
        </div>
    )
}