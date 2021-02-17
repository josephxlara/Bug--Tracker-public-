// General Imports
import React, { useContext, } from 'react';
import { Link } from 'react-router-dom';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context'

// SVG Imports
import BugLogo from '../SVGs/Bug--TrackerLogo.svg'


export default function SignInPage() {
    /**
     * * State constants from context provider:
     * * signIn --> main purpose: sign user in to application (method from firebase auth)
     */
    const { signIn } = useContext(bugTrackerPropProvider);

    return (
        <>
            <div className='needAnAccountDiv'>
                Don't have an account? Be sure to create one with Google, &nbsp;<a href='https://accounts.google.com/signup/v2/webcreateaccount?hl=en&flowName=GlifWebSignIn&flowEntry=SignUp' className='needAnAccountLink'>here!</a>
            </div>
            <div className='signInPageDiv' >
                <img className='bugLogo' src={BugLogo} alt='BugLogo' />
                <form className='signInForm' >
                    
                    <h1 >
                        Sign-In
                    </h1>
                    
                    <div className='lineDiv' />
                    
                    <button type='submit' onClick={signIn}>
                        Sign-In
                    </button>

                </form>
                <Link className='signInLink' to='forgotpassword'>Forgot your password?</Link>
            </div>
            <div className='footerDiv' >
                <p >
                    © Joseph Lara 2020
                </p>
                <p >
                    github.com/josephxlara
                </p>
            </div>
        </>
    )
}