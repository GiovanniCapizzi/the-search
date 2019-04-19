import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {navigate} from "@reach/router";


const styles = {
    root:{
        color: "#4285f4",
        fontSize: "3em",
        padding: 4,
        fontFamily:"relishproregular",
        marginBottom:16,
        userSelect:'none',
        fontWeight:750

    },
    eh:{
        color: "#ea4335"
    },
    a:{
        color: "#fbbc05"
    },
    c:{
        color: "#34a853"
    },
    the:{
        color: "#bdbdbd",
        fontSize: "0.3em",

    }


};

function Logo(props) {
    const { classes } = props;

    return (
        <div className={`${classes.root} ${props.className? props.className : ''}`} onClick={()=>navigate(`/`)}>
            <span className={classes.the}>The </span>
            S
            <span className={classes.eh}>e</span>
            <span className={classes.a}>a</span>
            r
            <span className={classes.c}>c</span>
            <span className={classes.eh}>h</span>
        </div>

    );
}

Logo.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Logo);