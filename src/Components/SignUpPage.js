// General Imports
import React, { useRef, useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { fireBaseAuthorize } from '../Firebase';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context'

// Components Import
import LoadingPage from './LoadingPage';


export default function SignUpPage() {
    /**
     * * State constants from context provider:
     * * signUp --> main purpose: sign user up to application
     * * setLoading --> set application to loading state before pushing to dashboard
     */
    const { setCurrentUser, signUp } = useContext(bugTrackerPropProvider);

    /**
     * * Component's state constants:
     * * error --> only purpose: to display error if unsuccessful sign in submission
     */
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Constants used to capture user's input in new project form
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    // Constant used to push user back to dashboard upon submission of new project form
    const history = useHistory();

    /**
     * * Async function created to sign user up
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match!');
        }

        try {
            setError('');
            setLoading(true);
            await signUp(emailRef.current.value, passwordRef.current.value);
            setLoading(false);
            history.push('/dashboard');
        } 
        
        catch {
            setError('Failed to create an account!');
        }
    }

    return loading ? <LoadingPage /> : (
        <div className='signUpPageDiv' >
            <form className='signUpForm' method='post' action='localhost:3000/' onSubmit={handleSubmit}>

                <h1 >
                    Sign-Up
                </h1>  
                <div className='lineDiv' />

                <label htmlFor='email' >Email</label>
                <input className='input' type='text' id='email' required  ref={emailRef} autoComplete="off" />

                <label htmlFor='password1' >Password</label>
                <input className='input' type='password' id='password1' required ref={passwordRef} autoComplete="off"/>
                
                <label htmlFor='password2' >Password Confirmation</label>
                <input className='input' type='password' id='password2' required ref={passwordConfirmRef} autoComplete="off"/>

                {error && <div className='signUpPageErrorDiv'> {error} </div>}
                
                <button type='submit'>
                    Sign-Up
                </button>

            </form>
            <Link className='signUpLink' to='/'>Already have an account?</Link>
        </div>
    )
}