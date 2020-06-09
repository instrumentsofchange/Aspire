import { connect } from 'react-redux'
import Login from '../components/Login'
import { authenticateUser } from '../actions/authentication-actions'

const mapStateToProps = (state) => {
    return state.users.authentication
}

const mapDispatchToProps = {
    authenticateUser
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)