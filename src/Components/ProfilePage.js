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
    const { currentUser, updatePassword } = useContext(bugTrackerPropProvider);

    // Constant used to push user back to dashboard upon submission of new project form
    const history = useHistory();

    /**
     * * Component's state constants
     */
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Constants used to capture user's input in update password form
    const passwordRef = useRef();
    const passwordRefVerify = useRef();

    /**
     * * Async function created to update password
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordRef.current.value !== passwordRefVerify.current.value) {
            return setError('Passwords do not match!');
        }

        try {
            setError('');
            setLoading(true);
            await updatePassword(passwordRef.current.value);
            setLoading(false);
            history.push('/dashboard');
        
        } catch {
            setError('Failed to sign in!');
        }

    }

    return loading ? <LoadingPage /> : (
        <div className='profilePageDiv' >
            <div className='headerDiv'>
                <Link to='/dashboard' ><img className='bug' style={{top: '2px'}} src={Bug} alt='bug' /></Link>
                <h2>{currentUser.email}</h2>
            </div>
            <div className='profilePageForm'>
                <form className='signInForm' onSubmit={handleSubmit} >
                    
                    <h1 >
                        Update Password
                    </h1>
                    <div className='lineDiv' />
                    
                    <label htmlFor='password1' >New Password</label>
                    <input className='input' type='password' required id='password1' ref={passwordRef} autoComplete='off' />

                    <label htmlFor='password2' >New Password Confirmation</label>
                    <input className='input' type='password' required id='password2' ref={passwordRefVerify} autoComplete='off' />

                    {error && <div className='signInPageErrorDiv'> {error} </div>}

                    <button type='submit' >
                        Update Password
                    </button>

                </form>
            </div>
        </div>
            
    )
}