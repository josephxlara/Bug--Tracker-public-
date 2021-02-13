// General Imports
import React, { useContext, useEffect, useState } from 'react';
import { fireBaseDatabase } from '../Firebase';
import nanoid from 'nanoid';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Component Imports
import LoadingPage from '../Components/LoadingPage';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context';

// SVG Imports
import PersonIcon from '../SVGs/PersonIcon.svg';
import NotCompleted from '../SVGs/NotCompletedIcon.svg';
import Completed from '../SVGs/CompletedIcon.svg';
import BugIcon from '../SVGs/Bug--TrackerLogo(bug).svg';
import XMark from '../SVGs/XMark.svg';
import CheckMark from '../SVGs/CheckMark.svg';
import Bug from '../SVGs/Bug--TrackerLogo(bug).svg';


export default function EditProjectPage() {
    /**
     * * State constants from context provider:
     * * currentUser --> main purpose: a prop that is used to initialize the whole project to the current user's info/data
     * * projectIDForProjectDetails --> only purpose: a constant which contains the correct UID for the project that we are currently editing
     * * bugIDForBugDetails --> only purpose: a constant which contains the correct UID for the bug that we are currently editing
     * * setBugIDForBugDetails --> only purpose: a constant which is set to the current bug's UID
     * * setBugNameForChatFeature --> set state constant to store bug name as prop
     * 
     */
    const { currentUser, projectUIDForProjectDetails, setBugUIDForBugDetails } = useContext(bugTrackerPropProvider)
    
    /**
     * * Component's state constants
     */
    const [currentProjectDetails, setCurrentProjectDetails] = useState();
    // State constants for project's members
    const [currentMembersUIDs, setCurrentMembersUIDs] = useState([]);
    const [currentMembersData, setCurrentMembersData] = useState([]);
    const [activeUsersFilteredCurrentMembers, setActiveUsersFilteredCurrentMembers] = useState();
    // State constants for project's bugs
    const [currentProjectsBugs, setCurrentProjectsBugs] = useState();
    // State constants for the add member form
    const [addMemberFormMemberName, setAddMemberFormMemberName] = useState('');
    const [memberUID, setMemberUID] = useState('');
    // State constants for the add bug form
    const [formBugName, setFormBugName] = useState('');
    const [formShortDescription, setFormShortDescription] = useState('');
    const [assignPriority, setAssignPriority] = useState('');
    const [assignBugToMember, setAssignBugToMember] = useState();
    
    const [loading, setLoading] = useState(true);

    // Constant used for select option in the add bug form
    const priority = ['low', 'medium', 'high']

    /**
     * * Async function created to retrieve user's project data
     */
    const fetchDataFromBase = async () => {
        // Axios API call to database to retrieve the current project's data
        const axiosGetCurrentProjectData = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}.json`)
        const axiosGetCurrentProjectDataData = axiosGetCurrentProjectData.data;
        setCurrentProjectDetails(axiosGetCurrentProjectDataData);

        // Creates a list of the project's member's UIDs
        setCurrentMembersUIDs(axiosGetCurrentProjectDataData.projectMembers ? Object.keys(axiosGetCurrentProjectDataData.projectMembers) : []);

        // Creates a list containing several dictionaries which contain the user's project's member's data
        setCurrentMembersData(axiosGetCurrentProjectDataData.projectMembers ? Object.values(axiosGetCurrentProjectDataData.projectMembers) : []);
        setCurrentProjectsBugs(axiosGetCurrentProjectDataData.projectBugs ? Object.values(axiosGetCurrentProjectDataData.projectBugs) : []);
        
        // Axios API call to get project's current active users
        const axiosGetCurrentUsers = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users.json`)
        const listOfProjectMembers = Object.keys(axiosGetCurrentProjectData.data.projectMembers)
        const listOfCurrentUsers = Object.keys(axiosGetCurrentUsers.data);
        
        // Filter through the list of the project's active users to exclude the ones that are members of the current project
        const filteredListOfUsers = listOfCurrentUsers.filter(user => !listOfProjectMembers.includes(user))
        setActiveUsersFilteredCurrentMembers(filteredListOfUsers);

        setLoading(false);
    }

    /**
     * * Async function created to add member
     */
    const addMember = async (e) => {
        e.preventDefault();

        // New member data provided for by the user
        const projectMemberData = { 
            memberName: addMemberFormMemberName,
            dateAddedToProject: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
            memberUID: memberUID,
        }

        // Push the newly created member to the current user's database
        await axios.put(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}/projectMembers/${memberUID}.json`, projectMemberData);
        
        // Axios API call to database to ensure we initialize our current project's details. The useEffect isn't called and thus doesn't update members 
        const axiosGetCurrentProjectDetails = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}.json`)
        const axiosGetCurrentProjectDetailsData = axiosGetCurrentProjectDetails.data;

        // Const created to store data that we will push to new member's database
        const dataToPushToUser = {
            completed: axiosGetCurrentProjectDetailsData.completed,
            dateCreated: axiosGetCurrentProjectDetailsData.dateCreated,
            managerOfProject: false,
            projectMembers: axiosGetCurrentProjectDetailsData.projectMembers,
            projectName: axiosGetCurrentProjectDetailsData.projectName,
            projectUID: axiosGetCurrentProjectDetailsData.projectUID,
            projectBugs: axiosGetCurrentProjectDetailsData.projectBugs
        }
        
        // Axios API call to push new data to new member
        await axios.put(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${memberUID}/userProjects/${axiosGetCurrentProjectDetailsData.projectUID}.json`, dataToPushToUser);

        // Axios API call to fetch project's current members
        const axiosGetCurrentMembers = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}/projectMembers.json`);
        // Filter out the current user UID and the newly created member because we already push data to those two members
        const axiosFilterCurrentUsers = Object.keys(axiosGetCurrentMembers.data).filter(user => user !== currentUser.uid && user !== memberUID);

        // For loop created to ensure we push new data to each project member
        for (var i = 0; i < axiosFilterCurrentUsers.length; i++) {
            await axios.put(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${axiosFilterCurrentUsers[i]}/userProjects/${axiosGetCurrentProjectDetails.data.projectUID}.json`, dataToPushToUser);
        }

        setAddMemberFormMemberName('');

        fetchDataFromBase();
    }

    /**
     * * Async function created to delete member
     * @param memberUID === soon to be deleted member UID
     */
    const deleteMember = async (memberUID) => {
        // When we delete a member, we want to delete the whole project from their DB. However, for the other members we only want to delete his UID.
        await axios.delete(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${memberUID}/userProjects/${projectUIDForProjectDetails}.json`)

        // Delete member's UID from all the project's members databases
        for (var i = 0; i < currentMembersUIDs.length; i++) {
            await axios.delete(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentMembersUIDs[i]}/userProjects/${projectUIDForProjectDetails}/projectMembers/${memberUID}.json`)
        }

        // Called due to memberUID being initialized to deleted memeber's UID
        setMemberUID('');
        
        fetchDataFromBase();
    }

    /**
     * * Async function created to push new bug to database
     */
    const pushNewBug = async (e) => {
        e.preventDefault();
        
        const newUID = nanoid(5);

        // New data for new bug provided by user
        const dataForNewBug = {
            bugName: formBugName,
            assignedMember: assignBugToMember,
            dateAddedToProject: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
            bugUID: newUID,
            shortDescription: formShortDescription,
            priority: assignPriority,
            completed: false,
        }

        // For any bug, we always want to push it to the currentUser's DB, who is the project manager
        await axios.put(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}/projectBugs/${newUID}.json`, dataForNewBug);
        
        // Push the bug to all users
        const filteredProjectMembers = currentMembersUIDs.filter(member => member !== currentUser.uid);
        for (var i = 0; i < filteredProjectMembers.length; i++) {
            await axios.put(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${filteredProjectMembers[i]}/userProjects/${projectUIDForProjectDetails}/projectBugs/${newUID}.json`, dataForNewBug);
        }

        // Reset bug form inputs to blank values
        setFormBugName('');
        setAssignPriority('');
        setAssignBugToMember('');
        setFormShortDescription('');

        setLoading(false);

        fetchDataFromBase();
    }

    /**
     * * Async function created to delete bug from all the project members' databases
     * @param bugUID === bug UID
     */
    const deleteBug = async (bugUID) => {
        // For loop created to delete from all members' databases
        for (var i = 0; i < currentMembersUIDs.length; i++) {
            await axios.delete(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentMembersUIDs[i]}/userProjects/${projectUIDForProjectDetails}/projectBugs/${bugUID}.json`)
        }

        fetchDataFromBase();
    }

    const setCompletion = async () => {
        // Axios API call to retrieve project's current completion status
        const axiosGet = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}/completed.json`)
        
        await fireBaseDatabase.ref(`Users/${currentUser.uid}/userProjects/${projectUIDForProjectDetails}`).child('completed').set(!axiosGet.data);

        fetchDataFromBase();
    }

    useEffect(() => {
        fetchDataFromBase();
    }, [])

    return loading ? (
        <LoadingPage />
    ) : (
        <div className='editProjectPageDiv'>
            <div className='projectHeaderDiv'>
                <div className='editProjectHeaderItems'>
                    <Link to='/dashboard'><img className='toDashboardBug' src={Bug} alt='bugLogo' /></Link>
                    <h1>
                        {`${currentProjectDetails.projectName} (edit)`}
                    </h1>
                    <Link to='/projectdetails' className='projectDetailsLink' >(details)</Link>
                </div>
            </div>

            <div className='editProjectMarginDiv'>
                <div className='editProjectID'>
                    <p>
                        Project UID: {currentProjectDetails.projectUID}
                    </p>
                    <div className='projectManagerDiv'>
                        <p>
                            Project Manager:
                        </p>
                        <img src={currentProjectDetails.managerOfProject ? CheckMark : XMark} alt='managerOfProject' />
                    </div>

                    <div className='dateCreatedDiv'>
                        <p>
                            Date Created: {currentProjectDetails.dateCreated}
                        </p>
                        
                    </div>

                    <div className='markCompleteDiv'>
                        <p>
                            Set Project Completion:
                        </p>
                        <img src={currentProjectDetails.completed ? Completed : NotCompleted } onClick={setCompletion} alt='completedNot' />
                    </div>
                </div>
                <div className='membersDiv'>
                    <div className='membersTitleDiv'>
                        <p>
                            Members
                        </p>
                    </div>

                    <div className='addMemberFormDiv'>
                        <form className='addMemberForm' onSubmit={addMember} style={{maxWidth: '400px'}}>
                            <h1 >
                                Add Member
                            </h1>
                            <div className='lineDiv' />
                            
                            <label htmlFor='memberName'>Member Name</label>
                            <input type='text' id='memberName' value={addMemberFormMemberName} autoComplete='off' required onChange={(e) => setAddMemberFormMemberName(e.target.value)} />
                            
                            <label htmlFor='memberUID' >Member UID</label>
                            <select id='memberUID' value={memberUID} required onChange={(e) => setMemberUID(e.target.value)}>
                                <option value='' hidden id='' />
                                {
                                    activeUsersFilteredCurrentMembers.map(user => {
                                        return (
                                            <option required value={user} id={user} key={user} >{user}</option>
                                        )
                                    })
                                }
                            </select>

                            <button className='addMemberButton' type='submit' >
                                Add Member
                            </button>

                        </form>

                    </div>
                    <div className='currentMembersDiv'>
                        <p>
                            Current Members: {`{${currentProjectDetails.projectMembers ?  Object.keys(currentProjectDetails.projectMembers).length : 0}}`}
                        </p>
                        <div className='currentMembers'>
                            {
                                currentMembersData.map(member => {
                                    const checkIfOwner = member.memberUID === currentUser.uid;

                                    return (
                                        <div className='memberDiv' key={member.memberUID} style={{maxWidth: '400px'}}> 
                                            <div className='memberNameDiv'>
                                                <h2 >{member.memberName}</h2>
                                                <div className='deleteMember'> 
                                                    {!checkIfOwner && <button value={member.memberUID} onClick={(e) => deleteMember(e.target.value)} >Delete</button>}
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
                                                    {checkIfOwner ? `ID: ${member.memberUID} (you!)` : `ID: ${member.memberUID}`}
                                                </h4>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <div className='bugsDiv'>
                    <div className='bugsTitleDiv'>
                        <p>
                            Bugs
                        </p>
                    </div>

                    <div className='addBugFormDiv'>
                        <form className='addBugForm' onSubmit={pushNewBug} style={{maxWidth: '400px'}}>
                            
                            <h1 >
                                Add Bug
                            </h1>
                            <div className='lineDiv' />
                            
                            <label htmlFor='bugName' >Bug Name</label>
                            <input className='input' required value={formBugName} onChange={(e) => {setFormBugName(e.target.value)}} type='text' id='bugName' autoComplete='off' />
                            
                            <label htmlFor='assignPriority'>Assign Priority</label>
                            <select id='assignPriority' required value={assignPriority} onChange={(e) => setAssignPriority(e.target.value)}>
                                <option value='' hidden />
                                {
                                    priority.map(priority => {
                                        return (
                                            <option value={priority} id={priority} key={priority}>{priority}</option>
                                        )
                                    })
                                }
                            </select>

                            <label htmlFor='assignMember'>Assign Member</label>
                            <select id='assignMember' required value={assignBugToMember} onChange={(e) => {setAssignBugToMember(e.target.value)}}> 
                                <option value='' hidden />
                                {
                                    currentMembersUIDs.map(user => {
                                        return (
                                                <option value={user} id={user} key={user}>{user}</option>
                                            )
                                    })
                                }
                           </select>

                            <label htmlFor='shortDescription'>Short Description</label>
                            <textarea id='shortDescription' value={formShortDescription} type='text' required autoComplete='off' onChange={(e) =>{setFormShortDescription(e.target.value)}} style={{resize: 'none'}} />

                            <button className='addMemberButton' type='submit' >
                                Add Bug
                            </button>

                        </form>
                    </div>

                    <div className='currentBugsDiv'>
                        <p>
                            Current Bugs: {`{${currentProjectDetails.projectBugs ?  Object.keys(currentProjectDetails.projectBugs).length : 0}}`}
                        </p>
                        <div className='currentBugs'>
                            {
                                currentProjectsBugs.map(bug => {
                                    return (
                                        <div className='bugDiv' key={nanoid(3)} style={{maxWidth: '400px'}}> 
                                            <div className='bugNameDiv' >
                                                <h2>
                                                    {bug.bugName}
                                                </h2>
                                                <div className='editDeleteIconBug'> 
                                                    <h2><Link onClick={setBugUIDForBugDetails(bug.bugUID)} to='/editbug' className='bugNameDivLink' >(edit)</Link></h2>
                                                    <button onClick={() => deleteBug(bug.bugUID)}>Delete</button>
                                                    <img src={BugIcon} alt='personIcon'></img>
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
                                                    {bug.assignedMember && bug.assignedMember === currentUser.uid ? `Assigned To: ${bug.assignedMember} (you!)` : `Assigned To: ${bug.assignedMember}`}
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