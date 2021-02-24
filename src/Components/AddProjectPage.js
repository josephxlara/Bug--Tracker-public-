// General Imports
import axios from 'axios';
import React, { useContext, useState } from 'react';
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

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [projectName, setProjectName] = useState('');
    
    // Constant used to push user back to dashboard upon submission of new project form
    const history = useHistory();

    /**
     * * Async function created to push new user-created project to database then reroute user to dashboard
     */
    const pushNewProjectToDatabase = async (e) => {
        e.preventDefault();
        
        // API call to database to get user's current projects.
        const getUsersProjectsNames = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects.json`)
        const getUsersProjectsNamesData = Object.values(getUsersProjectsNames.data);

        const projectsNames = getUsersProjectsNamesData.map(data => {
            return data.projectName;
        })

        // Notify user that that project exists already
        if (projectsNames.includes(projectName)) {
            setError('Project exists already!')
        } 

        else {
            setLoading(true);
            setProjectName('');
            await pushNewProject(projectName);
            history.push('/dashboard');
            setLoading(false);
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
                <input className='input' type='text' id='projectName' required autoComplete='off' value={projectName} onChange={(e) => setProjectName(e.target.value)}/>

                {error && <div className='signInPageErrorDiv'> {error} </div>}

                <button className='addProjectButton' type='submit' >
                    Add Project
                </button>

            </form>

        </div>
    )
}