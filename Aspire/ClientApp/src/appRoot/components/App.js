//3rd Party Libraries
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';


import AuthenticationAppContainer from '../../areas/users/containers/AuthenticationAppContainer';
import NavMenu from './NavMenu';
import IocLogoWhiteBg from '../../assets/IOCLogo-WhiteBG.png';

//Routers
import UserRouter from '../../areas/users/UserRouter';
import InstrumentsRouter from '../../areas/instruments/InstrumentsRouter';

//Comoponents
import LoadingSpinner from '../../areas/shared/components/LoadingSpinner';

const App = (props) => {
    const { initializing, user } = props;
        
    let content;
    
    if(initializing) {
        content = <LoadingSpinner />;
    } else if(user.isAuthenticated) {
        content = renderAuthenticatedApp(props);
    } else {
        content = <AuthenticationAppContainer />
    }

    return content;
}

const renderAuthenticatedApp = (props) => {
    const { 
        user,
        logoutUser
    } = props;
    
    return (
        <div>
            <NavMenu user={user} logout={logoutUser} />
            <Container>
                <Switch>
                    <Route path="/user">
                        <UserRouter />
                    </Route>
                    <Route path="/instruments">
                        <InstrumentsRouter />
                    </Route>
                    <Route path="/">
                        <div className="col-md-8 offset-md-2 text-center mt-3">
                            <img src={IocLogoWhiteBg} />
                        </div>
                    </Route>
                </Switch>
            </Container>
        </div>
    );
}

export default App;

// export default class App extends Component {

//     render() {
//         const { initializing, user } = this.props;
        
//         let content;

//         if(initializing) {
//             content = <h1>Loading...</h1>
//         } else if(user.isAuthenticated) {
//             content = this._renderAuthenticatedApp();
//         } else {
//             content = <AuthenticationAppContainer />
//         }

//         return(
//             <div>
//                 {content}
//             </div>
//         );
//     }

//     renderAuthenticatedApp = () => {
//         const { 
//             user,
//             logoutUser
//         } = this.props;
        
//         return (
//             <div>
//                 <NavMenu user={user} logout={logoutUser} />
//                 <Container>
//                     <Switch>
//                         <Route path="/user">
//                             <UserRouter />
//                         </Route>
//                         <Route path="/instruments">
//                             <InstrumentsRouter />
//                         </Route>
//                         <Route path="/">
//                             <div className="col-md-8 offset-md-2 text-center mt-3">
//                                 <img src={IocLogoWhiteBg} />
//                             </div>
//                         </Route>
//                     </Switch>
//                 </Container>
//             </div>
//         );
//     }
// } 