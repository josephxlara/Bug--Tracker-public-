// General Imports
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import nanoid from 'nanoid';

// Context Imports
import { bugTrackerPropProvider } from '../Contexts/Context';

// SVG Imports
import LoadingPage from '../Components/LoadingPage';
import PersonIcon from '../SVGs/PersonIcon.svg';
import Bug from '../SVGs/Bug--TrackerLogo(bug).svg';
import XMark from '../SVGs/XMark.svg';
import CheckMark from '../SVGs/CheckMark.svg';


export default function ProjectDetailsPage() {
    /**
     * * State constants from context provider:
     * * currentUser --> main purpose: a prop that is used to initialize the whole project to the current user's info/data
     * * projectIDForProjectDetails --> only purpose: a constant which contains the correct UID for the project that we are currently editing
     * * setBugUIDForBugDetails --> state constant to set bug UID as a prop
     * * setBugNameForChatFeature --> set state constant to store bug name as prop
     */
    const { currentUser, projectUIDForProjectDetails } = useContext(bugTrackerPropProvider);

    /**
     * * Component's state constants:
     * * projectDetails --> only purpose: to retrieve current user's project data from database
     * * currentMembers --> only purpose: to store the current project's members
     * * currentBugs --> only purpose: to store the current project's bugs
     * * loading --> set loading to true while data from database hasn't finished being retrieved yet
     */
    const [currentProjectDetails, setCurrentProjectDetails] = useState();
    const [currentMembers, setCurrentMembers] = useState();
    const [currentBugs, setCurrentBugs] = useState();
    const [loading, setLoading] = useState(true);

    /**
     * * Async function created to retrieve user's current projects from database & placed in useEffect
     */
    const getProjectDetails = async () => {
        // Axios API call to retrieve current project's details
        const axiosGetProjectDetails = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}.json`);
        const axiosGetProjectDetailsData = axiosGetProjectDetails.data;

        setCurrentProjectDetails(axiosGetProjectDetailsData);
        setCurrentMembers(axiosGetProjectDetailsData.projectMembers ? Object.values(axiosGetProjectDetailsData.projectMembers) : [])
        setCurrentBugs(axiosGetProjectDetailsData.projectBugs ? Object.values(axiosGetProjectDetailsData.projectBugs) : []);
        
        setLoading(false);
    }

    useEffect(() => {
        getProjectDetails();
    }, [])

    return loading ? (  
        <LoadingPage />
    ) : (
        <div className='projectDetailsDiv'>
            <div className='projectDetailsHeader'>
                <div className='projectDetailsItems'>
                    <Link to='/dashboard'><img className='toDashboardBug' src={Bug} alt='bugLogo' /></Link>
                    <h1>
                    {`${currentProjectDetails.projectName} (details)`}
                    </h1>
                    {currentProjectDetails.managerOfProject ? <h1><Link className='toEditProjectLink' to='/editproject'>(edit)</Link></h1> : <h1 style={{cursor: 'pointer'}}>(edit)</h1>}
                </div>
            </div>
                
            <div className='projectDetailsMarginDiv'>
                <div className='projectDetailsID'>
                    <p>
                        Project UID: {currentProjectDetails.projectUID}
                    </p>

                    <div className='projectCompletionDiv'>
                        <p>Completed: </p>
                        {currentProjectDetails.completed ? <img src={XMark} alt='checkMark' /> : <img src={XMark} alt='checkMark' />}
                    </div>

                    <div className='managerOfProjectDiv'>
                        <p>
                            Project Manager:
                        </p>
                        <img src={currentProjectDetails.managerOfProject ? CheckMark : XMark} alt='managerOfProject' />
                    </div>

                    <div className='editProjectCurrentMembers'>
                        <img src={PersonIcon} alt='personIcon' />
                        {currentProjectDetails.managerOfProject ? <Link className='editProjectLink' to='/editproject' >Current Members: {`{${currentProjectDetails.projectMembers ?  Object.keys(currentProjectDetails.projectMembers).length : 0}}`}</Link> : <p style={{cursor: 'pointer'}}>Current Members: {`{${currentProjectDetails.projectMembers ?  Object.keys(currentProjectDetails.projectMembers).length : 0}}`}</p>}
                    </div>

                    <div className='editProjectCurrentBugs'>
                        <img src={Bug} alt='bug' />
                        {currentProjectDetails.managerOfProject ? <Link className='editProjectLink' to='/editproject' >Current Bugs: {`{${currentProjectDetails.projectBugs ?  Object.keys(currentProjectDetails.projectBugs).length : 0}}`}</Link> : <p style={{cursor: 'pointer'}}>Current Bugs: {`{${currentProjectDetails.projectBugs ?  Object.keys(currentProjectDetails.projectBugs).length : 0}}`}</p>}
                    </div>
                    
                    <p>
                        Date Created: {currentProjectDetails.dateCreated}
                    </p>
                </div>
                <div className='projectDetailsCurrentMembers'>
                    <div className='projectDetailsCurrentMembersDiv'>
                        <div className='projectDetailsMembersTitleDiv'>
                            <p>
                                Current Members: {`{${currentProjectDetails.projectMembers ?  Object.keys(currentProjectDetails.projectMembers).length : 0}}`}
                            </p>
                        </div>
                        <div className='currentMembersCards' style={{maxWidth: '400px'}}>
                            {
                                currentMembers.map(member => {
                                    const checkIfOwner = member.memberUID === currentUser.uid;

                                    return (
                                        <div className='currentMemberDiv' key={member.memberUID} style={{maxWidth: '400px'}}> 
                                            <div className='memberNameDiv'>
                                                <h2>{member.memberName}</h2>
                                                <div className='deleteMember'> 
                                                    <img src={PersonIcon} alt='personIcon'></img>
                                                </div>
                                            </div>
                                            <div className='memberAddedDiv'>
                                                <h4>
                                                    {`Added To Project: ${member.dateAddedToProject}`}
                                                </h4>
                                            </div>
                                            <div className='memberUIDDiv'>
                                                <h4>
                                                    {checkIfOwner ? `UID: ${member.memberUID} (you!)` : `UID: ${member.memberUID}`}
                                                </h4>
                                            </div>
                                        </div>
                                    )
                                }) 
                            }
                        </div>
                    </div>
                </div>
                <div className='projectDetailsCurrentMembers'>
                    <div className='projectDetailsCurrentBugsDiv'>
                        <div className='projectDetailsBugsTitleDiv'>
                            <p>
                                Current Bugs: {`{${currentProjectDetails.projectBugs ?  Object.keys(currentProjectDetails.projectBugs).length : 0}}`}
                            </p>
                        </div>
                        <div className='currentBugsCards' style={{maxWidth: '400px'}}>
                            {
                                currentBugs.map(bug => {
                                    return (
                                        <div className='bugDiv' key={nanoid(3)} style={{maxWidth: '400px'}}> 
                                            <div className='bugNameDiv' >
                                                <h2>
                                                    <p>{bug.bugName}</p>
                                                </h2>
                                                <div className='currentEditDeleteIconBug'> 
                                                    {currentProjectDetails.managerOfProject ? <h1><Link className='toEditBugLink' to='/editbug'>(edit)</Link></h1> : <h1 className='notAllowedBugLink' >(edit)</h1>}
                                                    <img src={Bug} alt='personIcon'></img>
                                                </div>
                                            </div>
                                            <div className='shortDescription'>
                                                <p>
                                                    Issue: <i>{bug.shortDescription}</i>
                                                </p>
                                            </div>
                                            <div className='priorityDiv'>
                                                <h4>
                                                    Priority: {bug.priority}
                                                </h4>
                                            </div>
                                            <div className='completedDiv'>
                                                <div className='completedDivItems'>
                                                    <h4>
                                                        Completed:
                                                    </h4>
                                                    {bug.completed ? <img src={CheckMark} alt='checkMark' /> : <img src={XMark} alt='xMark' />}
                                                </div>
                                            </div>
                                            <div className='bugAddedDiv'>
                                                <h4>
                                                    Added To Project: {bug.dateAddedToProject}
                                                </h4>
                                            </div>
                                            <div className='bugIDDiv'>
                                                <h4>
                                                    Bug UID: {bug.bugUID}
                                                </h4>
                                            </div>
                                            <div className='assignedMemberDiv'>
                                                <h4>
                                                    {bug.assignedMember ? `Assigned To: ${bug.assignedMember}` : 'No assigned member!'}
                                                </h4>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}