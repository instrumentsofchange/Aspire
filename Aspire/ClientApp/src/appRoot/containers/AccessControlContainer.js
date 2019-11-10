import { connect } from 'react-redux';
import AccessControl from '../components/AccessControl';

const mapStateToProps = (state, props) => {
    return {
        currentUser: state.users.authentication,
        applicationPrivileges: props.applicationPrivileges
    }
}

export default connect(
    mapStateToProps
)(AccessControl)