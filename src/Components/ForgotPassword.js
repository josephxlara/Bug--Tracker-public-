// General Imports
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

// Context Imports
import { bugTrackerPropProvider } from '../Contexts/Context'

// SVG Imports
import BugLogo from '../SVGs/Bug--TrackerLogo.svg'

export default function ForgotPasswordPage() {
    /**
     * * State constants from context provider:
     * * resetPassword --> main purpose: reset user's password (method from firebase auth)
     */
    const { resetPassword } = useContext(bugTrackerPropProvider);
    
    /**
     * * Component's state constants
     * * error --> main purpose: display error upon unsuccessful reset password submission
     * * resetPasswordInput --> main purpose: state constant to store user input of email
     * * successMessage --> main purpose: display success message upon successful password reset email sent
     */
    const [error, setError] = useState('');
    const [resetPasswordInput, setResetPasswordInput] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    /**
     * * Async function created to send reset email confirmation
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            await resetPassword(resetPasswordInput);
            setSuccessMessage('Reset password email sent!')
            setResetPasswordInput('');
        
        } catch {
            setError('Failed to sign in!');
        }
    }
    
    return (
        <div className='forgotPasswordPageDiv' >
            <img className='bugLogo' src={BugLogo} alt='BugLogo' />
            <form className='forgotPasswordForm' method='post' action='localhost:3000/' onSubmit={handleSubmit}>

                <h1 >
                    Reset Password
                </h1>  
                <div className='lineDiv' />

                <label htmlFor='email' >Email</label>
                <input className='input' type='text' id='email' onChange={(e) => {setResetPasswordInput(e.target.value)}} required value={resetPasswordInput} autoComplete="off" />

                {error && <div className='forgotPasswordErrorDiv'> {error} </div>}
                {successMessage && <div className='successResetPasswordDiv'> {successMessage} </div>}
                
                <button type='submit'>
                    Reset Password
                </button>

            </form>
            <Link className='signUpLink' to='/signinpage'>Back to Sign-In</Link>
        </div>
    )
}