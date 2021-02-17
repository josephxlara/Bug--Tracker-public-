// General Imports
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './Styles/styles.scss';

// Prop Provider
import PropProvider from './Contexts/Context';

// Component Imports
import SignInPage from './Components/SignInPage';
import DashboardPage from './Components/DashboardPage';
import PrivateRoute from './Components/PrivateRoute';
import AddProjectPage from './Components/AddProjectPage'
import LoadingPage from './Components/LoadingPage';
import ProjectDetailsPage from './Components/ProjectDetailsPage';
import EditProjectPage from './Components/EditProjectPage';
import ForgotPasswordPage from './Components/ForgotPassword';
import EditBugPage from './Components/EditBugPage';
import ProfilePage from './Components/ProfilePage';


function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 750)
  }, [])

  return loading ? (
    <div className="App">
      <LoadingPage />
    </div>
  ) : (
    <div className="App">
        <Router >
          <PropProvider >
            <Switch >
              <PrivateRoute exact path='/dashboard' component={DashboardPage} />
              <PrivateRoute exact path='/addproject' component={AddProjectPage} />
              <PrivateRoute exact path='/projectdetails' component={ProjectDetailsPage} />
              <PrivateRoute exact path='/editproject' component={EditProjectPage} />
              <PrivateRoute exact path='/editbug' component={EditBugPage} />
              <PrivateRoute exact path='/profile' component={ProfilePage} />
              <Route exact path='/' component={SignInPage} />
              <Route exact path='/forgotpassword' component={ForgotPasswordPage} />
              <Route exact path='*' component={() => {'404 PAGE NOT FOUND'}} />
            </Switch>
          </PropProvider>
        </Router>
    </div>
  )
}

export default App;
