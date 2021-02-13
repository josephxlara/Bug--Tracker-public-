// General Imports
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

// Context Import
import { bugTrackerPropProvider } from '../Contexts/Context';

export default function PrivateRoute({ component: Component, ...rest }) {
    const { currentUser } = useContext(bugTrackerPropProvider);

    return (
        <Route {...rest} render={props => {
            return currentUser ? <Component {...props} to='/dashboard' /> : <Redirect to='/' />
        }} >
        </Route>
    )
}