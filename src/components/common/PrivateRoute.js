import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
const PrivateRoute = ({ component: Component, auths, ...rest }) => (
    
    <Route {...rest} render={props =>
        auths.isAuthenticated === true 
            ? <Component {...props} /> : <Redirect to="/sign-in" />
    }
    />
);

PrivateRoute.propTypes = {
    auths: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auths: state.auths
});

export default connect(mapStateToProps)(PrivateRoute);