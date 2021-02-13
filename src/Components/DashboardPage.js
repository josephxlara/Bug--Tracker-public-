// General Imports
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import nanoid from 'nanoid'
import axios from 'axios';

// Component Imports
import LoadingPage from './LoadingPage';

// SVG Imports
import Bug from '../SVGs/Bug--TrackerLogo(bug).svg';
import BugBlack from '../SVGs/Bug--TrackerLogo(bug)black.svg';
import ProfileIcon from '../SVGs/ProfileIcon.svg';
import CheckMark from '../SVGs/CheckMark.svg';
import XMark from '../SVGs/XMark.svg';
import PersonIcon from '../SVGs/PersonIcon.svg';
import SearchIcon from '../SVGs/SearchIcon.svg';
import NoAccess from '../SVGs/NoAccess.svg'
import MoreInfoIcon from '../SVGs/MoreInfoIcon.svg'
import MoreInfoIconBlack from '../SVGs/MoreInfoIconBlack.svg'
import LightBulb from '../SVGs/LightBulb.svg'
import ArrowLeft from '../SVGs/ArrowLeft.svg'
import ArrowLeftWhite from '../SVGs/ArrowLeftWhite.svg'
import ArrowRight from '../SVGs/ArrowRight.svg'
import ArrowRightWhite from '../SVGs/ArrowRightWhite.svg'
import Gear from '../SVGs/Gear.svg'
import ProjectIcon from '../SVGs/ProjectIcon.svg'

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context'


export default function DashboardPage() {
    /**
     * * State constants from context provider:
     * * currentUser --> main purpose: a prop that is used to initialize the whole project to the current user's info/data
     * * setProjectIDForProjectDetails --> only purpose: set project ID to provider state constant in order that we can pass that as a prop to other pages
     * * signOut --> only purpose: used to sign user out of account 
     */
    const { currentUser, setProjectUIDForProjectDetails, signOut, loading, setLoading } = useContext(bugTrackerPropProvider);

    /**
     * * Component's state constants:
     * * currentUserProjectsFromDatabase --> only purpose: to retrieve current user's project data from database
     * * userInputForFilterProjects --> only purpose: to filter through project's names from user input in filter feature
     * * moreInfoSlideShowNum --> only purpose: to increment or decrement a value for navigation purposes on the more information slides
     * * loading --> set loading to true while data from database hasn't finished being retrieved yet
     */
    const [currentUserProjectsFromDatabase, setCurrentUserProjectsFromDatabase] = useState([]);
    const [userInputForFilterProjects, setUserInputForFilterProjects] = useState('');
    const [moreInfoSlideShowNum, setMoreInfoSlideShowNum] = useState(0);

    // Search bar filter through user's current project's names
    const filteredUserProjects = currentUserProjectsFromDatabase.filter(data => {
        return data.projectName.toLowerCase().includes(userInputForFilterProjects.toLowerCase())
    })

    /**
     * * Async function created to retrieve user's current projects from database & placed in useEffect
     */
    const getUserData = async () => {
        // Axios API call to database to retrieve current user's project data
        const axiosGetUserProjects = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects.json`)
        
        // If statement created in order to prevent error due to 'Object.values()' not being able to: 'Object.values(null || undefined)' 
        if (axiosGetUserProjects.data) {
            setCurrentUserProjectsFromDatabase(Object.values(axiosGetUserProjects.data));
        } else {
            setCurrentUserProjectsFromDatabase([]);
        }

        // Upon completion of data retrieval, loading === false to display interface
        setLoading(false);
    }

    /**
     * * Async function created to delete project from current user's database and all of the project's members database
     * @param key === project's unique ID
     */
    const deleteProject = async (projectUID) => {
        // Axios API call to database to retrieve current user's member data
        const axiosGetCurrentProjectMembers = await axios.get(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${projectUID}/projectMembers.json`);

        const keysAxiosCurrentMembers = axiosGetCurrentProjectMembers.data;

        const currentMembers = Object.keys(keysAxiosCurrentMembers);

        // axiosGetCurrentProjectMembersData in order to prevent error from Object.keys(null || undefined)
        for (var i=0; i < currentMembers.length; i++) {
            await axios.delete(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentMembers[i]}/userProjects/${projectUID}.json`)
        }
        getUserData();
    }

    useEffect(() => {
        getUserData();
    }, [])

    return loading ? <LoadingPage /> : (
        <div className='dashboardPageDiv'>
            <div className='dashboardPageHeader'>
                <div className='dashboardHeaderItems'>
                    <Link to='/dashboard'><img className='bug' src={Bug} alt='bugLogo' /></Link>
                    <div className='projectNameMoreInfo'>
                        <p>Bug--Tracker ©2020</p> 
                        
                        <div className='moreInfoDiv'>
                            <img className='moreInfoIcon' src={MoreInfoIcon} alt='moreInfoIcon' />

                            {/* Drop Down Component */}
                            <div className='moreInfoDropDown'>
                                <div className='moreInfoDropDownHeader'>
                                    <div className='moreInfoHeaderItems'>
                                        <img className='bugBlackDropDown' src={BugBlack} alt='bug'></img>
                                        {
                                            (moreInfoSlideShowNum > 0) ? <div className='arrowDiv' style={{marginLeft: '64px'}} onClick={() => setMoreInfoSlideShowNum(moreInfoSlideShowNum - 1)}><img src={ArrowLeft} style={{cursor: 'default'}} alt={'arrowLeft'}/></div> : <div className='arrowDiv' style={{marginLeft: '64px'}} ><img src={ArrowLeftWhite} alt='arrowLeftWhite' /></div>
                                        }
                                        <div className='headerH1s'>
                                            {
                                                (moreInfoSlideShowNum === 0) && <h1>Welcome!</h1>
                                            }
                                            {                                       
                                                (moreInfoSlideShowNum === 1) && <h1>Step 1</h1>
                                            }
                                            {
                                                (moreInfoSlideShowNum === 2) && <h1>Managing</h1>
                                            }
                                            {
                                                (moreInfoSlideShowNum === 3) && <h1>Navigation</h1>
                                            }
                                        </div>
                                        {
                                            (moreInfoSlideShowNum < 3) ? <div style={{marginLeft: '292px'}} onClick={() => setMoreInfoSlideShowNum(moreInfoSlideShowNum + 1)} className='arrowDiv'><img src={ArrowRight} style={{cursor: 'default'}} alt={'arrowLeftWhite'}/></div> : <div style={{marginLeft: '308px'}} className='arrowDiv'><img src={ArrowRightWhite} alt='arrowLeft' /></div>
                                        }
                                        <img className='moreInfoIconDropDown' src={MoreInfoIconBlack} alt='moreInfoIcon'></img>
                                    </div>
                                    {
                                        (moreInfoSlideShowNum === 0) && 
                                        <div className='firstSlide'>
                                            <div className='introductionDiv'>
                                                <img src={LightBulb} alt='lightBulb' />
                                                <h6>Introduction</h6>
                                            </div>
                                            <p>
                                                • Bug--Tracker is an application designed to help you and your team manage your
                                                coding project's bugs, or issues.
                                                <br /> 
                                                • In the ensuing slides you will find a few helpful
                                                tips for better navigating the site along with an explanation
                                                of some of the application's key features!
                                            </p>
                                        </div>
                                    }
                                    {
                                        (moreInfoSlideShowNum === 1) && 
                                        <div className='secondSlide'>
                                            <div className='firstStepDiv'>
                                                <img src={Gear} alt='gear' />
                                                <h6>Create A Project</h6>
                                            </div>
                                            <p>
                                                • If you haven't already, be sure to create your very own first project by pressing on the 'Add Project'
                                                button to the left. 
                                                <br />
                                                • This will do a few things: 1) initialize your data in our database,
                                                2) make you the manager of that project which means you'll be able to add or delete 
                                                members and add or delete bugs!
                                            </p>
                                        </div>
                                    }
                                    {
                                        (moreInfoSlideShowNum === 2) && 
                                        <div className='thirdSlide'>
                                            <div className='managingDiv'>
                                                <img src={ProjectIcon} alt='gear' />
                                                <h6>Managing a Project</h6>
                                            </div>
                                            <p>
                                                • Managing a project can be tough. Which is why we created a chat feature
                                                where you, the manager, can stay updated on a bug's progress.
                                                <br />
                                                • Simply assign a bug to a project member and 
                                                the both of you will have access to that bug's details page where you can chat
                                                concerning this bug's progress. <i>(Feature coming soon...)</i>
                                            </p>
                                        </div>
                                    }
                                    {
                                        (moreInfoSlideShowNum === 3) && 
                                        <div className='fourthSlide'>
                                            <div className='navigation'>
                                            </div>
                                            <p >
                                                • <u>Edit</u> → edit project page
                                                <br />
                                                • <u>projectName</u> → project details page
                                                <br />
                                                • To edit a bug, first click on the project's <u>Edit</u> right here on the dashboard 
                                                then <u>Edit</u> again on the bug's card where you will be taken to the edit bug page
                                                <br />
                                                • <u>bugName</u> → bugs details page <i>(coming soon)</i>
                                                <br />
                                                • Bug Icon → back to dashboard
                                                <br />
                                                • Profile Icon → update password
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <Link to='/profile'><img className='profileIcon' style={{position: 'relative', top: '3px'}} src={ProfileIcon} alt='profileIcon' /></Link>
                </div>
            </div>

            <div className='dashboardMarginDiv'>
                {/* Div containing user's UID and filter project feature */}
                <div className='userInfoHeader'>
                    <p>
                        User UID: {currentUser.uid}
                    </p>
                    <div className='filterDiv'>
                        <div className='filterDivSearchIcon'>
                            <img src={SearchIcon} alt='searchIcon' />
                        </div>
                        <div className='filterDivInput'>
                            <input type='text' placeholder='Search for projects...' onChange={(e) => setUserInputForFilterProjects(e.target.value)}/>
                        </div>
                    </div>
                </div>

                <div className='addProjectSignOutDiv'>
                    <div className='addProjectLinkDiv'>
                        <Link to='/addproject' className='addProjectLink' >
                            Add Project
                        </Link>
                    </div>

                    <button className='signOutButton' onClick={signOut}>Sign-Out</button>
                </div>

                <div className='tableTitleDiv'>
                    <h1>{currentUser.email}'s Current Projects</h1>
                </div>

                <div className='userTableDiv'>
                    <div className='userTableMarginDiv'>
                        <table style={{maxWidth: '1100px'}}>
                            <thead >

                            <tr key={nanoid(4)}>
                                <th style={{borderTopLeftRadius: '4px'}} >Name</th>
                                <th >Members</th>
                                <th >Bugs</th>
                                <th >Created On</th>
                                <th >Completed</th>
                                <th >UID</th>
                                <th>Manager</th>
                                <th >Edit</th>
                                <th style={{borderTopRightRadius: '4px'}}>Delete</th>
                            </tr>
                            {
                                filteredUserProjects.map(project => {
                                    return (
                                        <tr key={nanoid(4)} >
                                            <td><Link to='/projectdetails' style={{color: 'white'}} onClick={() => setProjectUIDForProjectDetails(project.projectUID)} >{project.projectName}</Link></td>
                                            
                                            <td style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <h1 style={{display: 'flex', marginRight: '6px', fontWeight: '500'}}>
                                                        {project.projectMembers ?  Object.keys(project.projectMembers).length : 0}
                                                    </h1>
                                                    <img src={PersonIcon} alt='personIcon' style={{display: 'flex', height: '20px', marginLeft: '6px'}}/>
                                                </div>
                                            </td>
                                            
                                            <td style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 15px 0 15px'}}>
                                                    <h1 style={{display: 'flex', marginRight: '6px', fontWeight: '500'}}>
                                                        {project.projectBugs ? Object.keys(project.projectBugs).length : 0}
                                                    </h1>
                                                    <img src={Bug} alt='bug' style={{display: 'flex', height: '20px', marginLeft: '6px'}}/>
                                                </div>
                                            </td>

                                            <td>{project.dateCreated}</td>

                                            <td>{project.completed ? <img alt='checkMark' style={{height: '28px'}} src={CheckMark} /> : <img alt='checkMark' style={{height: '28px'}} src={XMark} />}</td>
                                            
                                            <td>{project.projectUID ? project.projectUID : null}</td>

                                            <td>{project.managerOfProject ? 'yes' : 'no'}</td>
                                            
                                            <td>{project.managerOfProject ? <Link className='editProjectLinkDashboard' to='/editproject' style={{color: 'white'}} onClick={() => setProjectUIDForProjectDetails(project.projectUID)}>(edit)</Link> : <p>(edit)</p>}</td>
                                            
                                            <td><div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> {project.managerOfProject ? <button style={{width: '56px', display: 'flex'}} onClick={() => deleteProject(project.projectUID)}>Delete</button> : <img src={NoAccess} style={{height: '20px'}} alt='noAccess' />} </div></td>
                                        </tr>
                                    )
                                })
                            }

                            </thead>

                        </table>
                    </div>
                    

                </div>
            </div>
            
        </div>
    )
}