// General Imports
import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context'

// SVG Imports
import BugLogo from '../SVGs/Bug--TrackerLogo.svg'
import GoogleFavicon from '../SVGs/GoogleFavicon.svg'
import LoadingPage from './LoadingPage';


export default function SignInPage() {
    /**
     * * State constants from context provider:
     * * signIn --> main purpose: sign user in to application (method from firebase auth)
     */
    const { signIn } = useContext(bugTrackerPropProvider);

    const history = useHistory();

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await signIn();
            history.push('/dashboard');
            setLoading(false);
        }

        catch {
            setLoading(true);
            setError('Failed to sign in!');
            setLoading(false);

        }
    }

    return loading ? <LoadingPage /> : (
        <>
            <div className='needAnAccountDiv'>
                Don't have a Google account? Be sure to create one, &nbsp;<a href='https://accounts.google.com/signup/v2/webcreateaccount?hl=en&flowName=GlifWebSignIn&flowEntry=SignUp' className='needAnAccountLink'>here!</a>
            </div>
            <div className='signInPageDiv' >
                <img className='bugLogo' src={BugLogo} alt='BugLogo' />
                <form className='signInForm' onSubmit={handleSubmit}>
                    
                    <h1 >
                        Sign In
                    </h1>
                    
                    <div className='lineDiv' />
                    
                    <button type='submit' >
                        <img src={GoogleFavicon} alt='googleFavicon' className='googleFavicon' />
                        <p>Sign in with Google</p>
                    </button>

                    {error && <div className='signInPageErrorDiv'> {error} </div>}

                </form>
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