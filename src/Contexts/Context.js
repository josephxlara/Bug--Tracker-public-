// General Imports
import React, { createContext, useState, useEffect } from 'react';
import { fireBaseAuthorize, fireBaseDatabase, googleProvider } from '../Firebase';
import { useHistory } from 'react-router-dom';
import nanoid from 'nanoid';
import axios from 'axios';
import LoadingPage from '../Components/LoadingPage';

// Context Provider
export const bugTrackerPropProvider = createContext();

export default function PropProvider(props) {
    /**
     * * Context's state constants
     * * currentUser --> state constant used to store currentUser information
     * * projectIDForProjectDetails --> state constant used to store current projectUID
     * * bugIDForProjectDetails --> state constant used to store current bugUID
     * * bugNameForChatFeature --> state constant to store bug name as prop
     * * loading --> set loading to true while data from database hasn't finished being retrieved yet
     */
    const [currentUser, setCurrentUser] = useState('');
    const [projectUIDForProjectDetails, setProjectUIDForProjectDetails] = useState();
    const [bugUIDForBugDetails, setBugUIDForBugDetails]= useState();
    const [bugNameForChatFeature, setBugNameForChatFeature] = useState();
    const [loading, setLoading] = useState(false);

    // Constant used to push user back to dashboard upon submission of new project form
    const history = useHistory();

    // User Authentication Methods
    const signIn = async () => {
        return await fireBaseAuthorize.signInWithPopup(googleProvider);
    }

    const signUp = (email, password) => {
        return fireBaseAuthorize.createUserWithEmailAndPassword(email, password);
    }
    
    const signOut = () => {
        return fireBaseAuthorize.signOut();
    }

    const resetPassword = (email) => {
        return fireBaseAuthorize.sendPasswordResetEmail(email);
    }


    // Database
    const pushNewProject = async (newProject) => {
        const newUID = nanoid(5);
        
        const firstMemberData = {
            displayName: currentUser.displayName,
            dateAddedToProject: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
            memberUID: currentUser.uid,
            memberEmail: currentUser.email
        }

        // Set new project data in database
        await fireBaseDatabase.ref(`Users/${currentUser.uid}/userProjects/${newUID}`).set({
            dateCreated: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
            completed: false,
            projectName: `${newProject}`,
            projectUID: `${newUID}`,
            managerOfProject: true,
            projectMembers: null,
            managerOfProjectUID: currentUser.uid
        })

        // Also push the user's email/display name to the database
        const userData = {
            userEmail: currentUser.email,
            displayName: currentUser.displayName,
            userUID: currentUser.uid
        }
        await fireBaseDatabase.ref(`Users/${currentUser.uid}`).child('userData').set(userData)

        // important:  add user as a member to their own project
        await axios.put(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${newUID}/projectMembers/${currentUser.uid}.json`, firstMemberData);

        history.push('/dashboard');
    }

    useEffect(() => {
        fireBaseAuthorize.onAuthStateChanged(user => {
            setCurrentUser(user);

            history.push('/dashboard')
        })
    }, [])

    const properties = {
        signUp,
        signIn,
        signOut,
        resetPassword,
        currentUser,
        setCurrentUser,
        loading,
        setLoading,
        pushNewProject,
        projectUIDForProjectDetails,
        setProjectUIDForProjectDetails,
        bugUIDForBugDetails,
        setBugUIDForBugDetails,
        bugNameForChatFeature,
        setBugNameForChatFeature
    }

    return loading ? <LoadingPage /> : (
        <bugTrackerPropProvider.Provider value={properties} >
            {props.children}
        </bugTrackerPropProvider.Provider >
    )

}