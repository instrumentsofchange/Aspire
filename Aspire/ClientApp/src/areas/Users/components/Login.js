import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import IocLogoWhiteBg from '../../../assets/IOCLogo-WhiteBG.png';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleLoginClick = (e) => {
        e.preventDefault();
        
        this.props.authenticateUser(this.state);
    }

    render() {
        const { isLoading } = this.props;

        return isLoading 
            ? <LoadingSpinner />
            : this.renderLoginForm(); 
    }

    renderLoginForm = () => {
        const { 
            username,
            password
        } = this.state;

        const { invalidLogin } = this.props;
        
        return(
            <div className="text-center">
                <div className="mt-5 mb-5">
                    <img src={IocLogoWhiteBg} height="150" />
                </div>
                <form onSubmit={this.handleLoginClick} style={{width: '100%', maxWidth: '330px', padding: '15px', margin: 'auto'}}>
                    <h1 className="h3 mb-3 font-weight-normal">Admin Sign In</h1>

                    {
                        invalidLogin &&
                        <Alert color="danger">Invalid Login</Alert>
                    }
                    
                    <label htmlFor="username" className="sr-only">Username</label>
                    <input type="text" id="username" name="username" className="form-control" placeholder="Username" autoFocus value={username} onChange={this.handleChange} />
                    
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input type="password" id="password" name="password" className="form-control" placeholder="Password" value={password} onChange={this.handleChange} />

                    <span>New student sign up? click <Link to="/student/sign-up">here</Link>!</span>

                    <button className="btn btn-lg btn-primary btn-block mt-3" type="submit">Sign In</button>
                </form>
            </div>
        );
    }
}

Login.propTypes = {
    authenticateUser: PropTypes.func.isRequired
}