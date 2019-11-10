import { connect } from 'react-redux';
import { 
    fetchPrograms,
    createUser
} from '../actions/create-user-actions';
import CreateUser from '../components/CreateUser';

const mapStateToProps = (state) => {
    return state.users.create
}

const mapDispatchToProps = {
    fetchPrograms,
    createUser
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateUser);