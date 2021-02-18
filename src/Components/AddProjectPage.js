// General Imports
import React, { useContext, useState, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context';

// SVG Imports
import Bug from '../SVGs/Bug--TrackerLogo(bug).svg';
import LoadingPage from './LoadingPage';

export default function AddProjectPage() {
    /**
     * * State constants from context provider:
     * * currentUser --> main purpose: retrieve current user's data from database
     * * pushNewProject --> only purpose: push new project created by user to database
     */
    const { currentUser, pushNewProject } = useContext(bugTrackerPropProvider);

    const [loading, setLoading] = useState(false);
    
    // Constant used to push user back to dashboard upon submission of new project form
    const history = useHistory();

    // Constants used to capture user's input in new project form
    const projectNameRef = useRef();

    /**
     * * Async function created to push new user-created project to database then reroute user to dashboard
     */
    const pushNewProjectToDatabase = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await pushNewProject(projectNameRef.current.value);
            history.push('/dashboard');
            setLoading(false);
        } 
        
        catch {
            return null;
        }
    }

    return loading ? <LoadingPage /> : (
        <div className='addProjectDiv'>
            <div className='headerDiv'>
                <Link to='/dashboard' ><img className='bug' style={{top: '2px'}}src={Bug} alt='bug' /></Link>
                <h2>{currentUser.displayName}</h2>
            </div>
            <form className='addProjectForm' onSubmit={pushNewProjectToDatabase}>
                    
                <h1 >
                    Add Project
                </h1>
                <div className='lineDiv' />

                <label htmlFor='projectName' >Project Name</label>
                <input className='input' type='text' id='projectName' required autoComplete='off' ref={projectNameRef} />

                <button className='addProjectButton' type='submit' >
                    Add Project
                </button>

            </form>

        </div>
    )
}