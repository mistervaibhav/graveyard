import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// * STYLES
import './style.css';

// * COMPONENTS
import Navbar from '../components/navbar/Navbar';

// * PAGES
import Home from '../pages/home/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import CreateProject from '../pages/project/CreateProject';
import ProjectDetails from '../pages/project/ProjectDetails';

function App() {
  return (
    <div className='app'>
      <BrowserRouter>
        <header>
          <Navbar />
        </header>
        <main>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/new' component={CreateProject} />
            <Route exact path='/project/:id' component={ProjectDetails} />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
