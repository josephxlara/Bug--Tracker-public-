// General Imports
import React, { createContext, useState, useEffect } from 'react';
import { fireBaseAuthorize, fireBaseDatabase } from '../Firebase';
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
    const signIn = (email, password) => {
        return fireBaseAuthorize.signInWithEmailAndPassword(email, password);
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

    const updateEmail = (email) => {
        return currentUser.updateEmail(email);
    }

    const updatePassword = (password) => {
        return currentUser.updatePassword(password);
    }


    // Database
    const pushNewProject = async (newProject, managerName) => {
        const newUID = nanoid(8);
        
        const firstMemberData = {
            memberName: managerName,
            dateAddedToProject: `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`,
            memberUID: currentUser.uid,
            assignedBug: null
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

        // Also push the user's email to the database
        await fireBaseDatabase.ref(`Users/${currentUser.uid}`).child('userEmail').set(currentUser.email)

        // important:  add user as a member to their own project
        await axios.put(`https://bug--tracker---developer-default-rtdb.firebaseio.com/Users/${currentUser.uid}/userProjects/${newUID}/projectMembers/${currentUser.uid}.json`, firstMemberData);

        history.push('/dashboard');
    }

    useEffect(() => {
        fireBaseAuthorize.onAuthStateChanged(user => {
            setCurrentUser(user);

            history.push('/dashboard');
        })
    }, [])

    const properties = {
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateEmail,
        updatePassword,
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