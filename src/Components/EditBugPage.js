// General Imports
import React, { useContext, useState, useEffect } from 'react';
import { fireBaseDatabase } from '../Firebase';
import { useHistory, Link } from 'react-router-dom';
import axios from 'axios';

// Component Imports
import LoadingPage from './LoadingPage';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context';

// SVG Imports
import Bug from '../SVGs/Bug--TrackerLogo(bug).svg';
import NotCompleted from '../SVGs/NotCompletedIcon.svg';
import Completed from '../SVGs/CompletedIcon.svg';


export default function EditBugPage() {
     /**
     * * State constants from context provider:
     * * currentUser --> main purpose: a prop that is used to initialize the whole project to the current user's info/data
     * * bugIDForBugDetails --> only purpose: a constant which contains the correct UID for the bug that we are currently editing
     * * projectIDForProjectDetails --> only purpose: a constant which contains the correct UID for the project that we are currently editing
     */
    const { currentUser, bugUIDForBugDetails, projectUIDForProjectDetails } = useContext(bugTrackerPropProvider);
    
    /**
     * * Component's state constants:
     * * bugDetails --> only purpose: to retrieve current bug's data from the database
     * * priority --> only purpose: to set new priority for bug updates from user select option selection
     * * shortDescription --> only purpose: to set new short description for bug updates from user select option selection
     * * currentMembers --> 
     * * loading --> set loading to true while data from database hasn't finished being retrieved yet
     */
    const [bugDetails, setBugDetails] = useState();
    const [assignedMember, setAssignedMember] = useState();
    const [priority, setPriority] = useState();
    const [shortDescription, setShortDescription] = useState();
    const [assignDifferentMember, setAssignDifferentMember] = useState();
    const [projectMembers, setProjectMembers] = useState();
    const [loading, setLoading] = useState(true);

    // Constant used to push user back to edit project upon submission of changes to current bug
    const history = useHistory();

    // Constant used for select option in edit bug form
    const priorityList = ['low', 'medium', 'high']

    /**
     * * Async function created to retrieve user's current bug's details from database & placed in useEffect
     */
    const getBugData = async () => {
        // Axios API call to database to retrieve current bug's data
        const axiosGetBugDetails = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}/projectBugs/${bugUIDForBugDetails}/.json`);
        setBugDetails(axiosGetBugDetails.data);

        // Axios APi call to database to retrieve project's current members
        const axiosGetProjectsMembers = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}/projectMembers.json`);
        const axiosGetProjectMembersUIDs = Object.keys(axiosGetProjectsMembers.data);
        setProjectMembers(axiosGetProjectMembersUIDs);

        // Filter through list of project's current members in order that we don't render the currently assigned member in select option
        const filteredListMembers = axiosGetProjectMembersUIDs.filter(key => key !== axiosGetBugDetails.data.assignedMember);
        setAssignDifferentMember(filteredListMembers);

        setLoading(false);
    }

    /**
     * * Async function created to update bug with new information provided by the user
     */
    const pushNewDataToBug = async (e) => {
        e.preventDefault();

        const newDataForBug = {
            assignedMember,
            priority,
            shortDescription
        }
        
        // For loop in order that we update the databases of all of the project's members
        for (var i = 0; i < projectMembers.length; i++) {
            await axios.patch(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${projectMembers[i]}/userProjects/${projectUIDForProjectDetails}/projectBugs/${bugUIDForBugDetails}/.json`, newDataForBug)
        }
        
        // Push user back to edit project upon submission of edit bug form
        history.push('/editproject')

        setLoading(false);
    }
    
    /**
     * * Async function created to update bug's completion status
     */
    const setBugCompletion = async () => {
        const axiosGetBugCompletion = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}/projectBugs/${bugUIDForBugDetails}/completed.json`)
        
        await fireBaseDatabase.ref(`Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}/projectBugs/${bugUIDForBugDetails}`).child('completed').set(!axiosGetBugCompletion.data);

        getBugData();
    }

    useEffect(() => {
        getBugData();
    }, [])
    
    return loading ? (
        <LoadingPage />
    ) : (
        <div className='editBugDiv'>
            <div className='editBugHeader'>
                <div className='editBugItems'>
                    <Link to='/dashboard'><img className='toDashboardBug' src={Bug} alt='bugLogo' /></Link>
                    <h1>
                        {`${bugDetails.bugName} (edit)`}
                    </h1>
                    <h1><Link className='toBugDetailsLink' to='/bugdetails'>(details)</Link></h1>
                </div>
            </div>
            <div className='editBugMarginDiv'>
                <div className='editBugInfoDiv'>
                    <div className='editBugID'>
                        <p>Bug UID: {bugDetails.bugUID}</p>
                    </div>

                    <div className='dateAddedToProject'>
                        <p>
                            Date Created: {bugDetails.dateAddedToProject}
                        </p>
                    </div>
                    
                    <div className='setBugCompletion'>
                        <p>
                            Set Bug Completion:
                        </p>
                        <img src={bugDetails.completed ? Completed : NotCompleted } onClick={setBugCompletion} alt='completedNot' />
                    </div>
                </div>

                <div className='editBugFormDiv'>
                    <form className='editBugForm' onSubmit={pushNewDataToBug} >
                    
                    <h1 >
                        Edit Bug
                    </h1>
                    <div className='lineDiv' />

                    <label htmlFor='assignMember'>Assign Different Member</label>
                    <select id='assignMember' onChange={(e) => setAssignedMember(e.target.value)}>
                    <option value='' hidden >{`Current member: ${bugDetails.assignedMember}`}</option>
                        {
                            assignDifferentMember.map(user => {
                                return (
                                        <option value={user} key={user}>{user}</option>
                                    )
                            })
                        }
                    </select> 
                    
                    <label htmlFor='priority' >Edit Priority</label>
                    <select id='assignPriority' onChange={(e) => setPriority(e.target.value)}>
                        <option value='' hidden >{`Current priority: ${bugDetails.priority}`}</option>
                        {
                            priorityList.map(priority => {
                                return (
                                        <option value={priority} id={priority} key={priority}>{priority}</option>
                                    )
                            })
                        }
                    </select>

                    <label htmlFor='shortDescription' >Edit Short Description</label>
                    <textarea className='input' onChange={(e) => {setShortDescription(e.target.value)}} placeholder={`Current short description: ${bugDetails.shortDescription}`} type='text' id='shortDescription' autoComplete='off' style={{resize: 'none'}} />

                    <button className='addProjectButton' type='submit' >
                        Submit Changes
                    </button>
    
                    </form> 
                </div>   
            </div>
        </div>
    )


}