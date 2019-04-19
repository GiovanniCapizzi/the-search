import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Logo from "../Home/Logo";
import robot from "./robot.png"
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        marginTop: 24,
        width: "38%",
        textAlign: "left",
        fontSize: "16px",
    },
    logo: {
        fontSize: "1em",
    },
    that:{
        color: "#757575"
    }

});

function NotFound(props) {
    const {classes} = props;
    return (
        <Grid container spacing={12} className={classes.root}>
            <Grid item xs={8}>
                <a href="/" className={classes.logo}>
                    <Logo/>
                </a>
                <p><b>404.</b> <span className={classes.that}>That’s an error.</span> </p>
                <p>The requested URL <code>{window.location.pathname}</code> was not found on this server.
                    <p className={classes.that}>That’s all we know.</p>
                </p>
            </Grid>
            <Grid item xs={4}>
                <img src={robot} alt="robot"/>
            </Grid>
        </Grid>
    );
}

NotFound.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound);