// General Imports
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { fireBaseAuthorize } from '../Firebase';

// Component Imports
import LoadingPage from './LoadingPage';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context'

// SVG Imports
import BugLogo from '../SVGs/Bug--TrackerLogo.svg'


export default function SignInPage() {
    /**
     * * State constants from context provider:
     * * signIn --> main purpose: sign user in to application (method from firebase auth)
     */
    const { signIn, setCurrentUser, currentUser } = useContext(bugTrackerPropProvider);

    /**
     * * Component's state constants:
     * * error --> only purpose: to display error if unsuccessful sign in submission
     * * loading --> set loading to true while data from database hasn't finished being retrieved yet
     */
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Constants used to capture user's input in new project form
    const emailRef = useRef();
    const passwordRef = useRef();

    // Constant used to push user back to dashboard upon submission of new project form
    const history = useHistory();

    /**
     * * Async function created to sign user in
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
 
        setError('');

        try {
            setLoading(true);
            await signIn(emailRef.current.value, passwordRef.current.value);
            history.push('/dashboard');
            setLoading(false);
        
        } catch {
            setLoading(false);
            setError('Failed to sign in!');
        }
    }

    return loading ? <LoadingPage /> : (
        <>
            <div className='needAnAccountDiv'>
                Don't have an account? Click&nbsp;<Link to='/signup' className='needAnAccountLink'>here!</Link>
            </div>
            <div className='signInPageDiv' >
                <img className='bugLogo' src={BugLogo} alt='BugLogo' />
                <form className='signInForm' onSubmit={handleSubmit} >
                    
                    <h1 >
                        Sign-In
                    </h1>
                    
                    <div className='lineDiv' />
                    
                    <label htmlFor='email' >Email</label>
                    <input className='input' type='text' id='email' required ref={emailRef} autoComplete='off' />
                    
                    <label htmlFor='password' >Password</label>
                    <input className='input' type='password' id='password' required ref={passwordRef} autoComplete='off' />

                    {error && <div className='signInPageErrorDiv'> {error} </div>}
                    
                    <button type='submit' >
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