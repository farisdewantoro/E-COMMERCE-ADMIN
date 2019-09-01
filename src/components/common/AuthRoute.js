import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
const AuthRoute = ({ component: Component, auths, ...rest }) => (

    <Route {...rest} render={props =>
        auths.isAuthenticated === false
            ? <Component {...props} /> : <Redirect to="/" />
    }
    />
);

AuthRoute.propTypes = {
    auths: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auths: state.auths
});

export default connect(mapStateToProps)(AuthRoute);