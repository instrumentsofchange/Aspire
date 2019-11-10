import React, { Component } from 'react';
// import PropType from 'prop-types';

export default class AccessControl extends Component {

    accessAllowed = () => {
        return this.props.applicationPrivileges.some(allowedPrivilege => {
            return this.props.currentUser.role === allowedPrivilege;
        });        
    }

    render() {
        let content = null;

        if(this.accessAllowed()) {
            content = this.props.children;
        } else {
            content = (<h1>Access Denied.</h1>);
        }

        return content;
    }
}