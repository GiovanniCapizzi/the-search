import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


const styles = theme => ({
    root:{
        marginTop:24
    },
    button: {
        margin: theme.spacing.unit,
        backgroundColor:"#f4f4f4",
        boxShadow:'none',
        textTransform: "none",
        fontWeight: "lighter",

    },
    input: {
        display: 'none',
    },
});


function Buttons(props) {

    const { classes } = props;
    return (
        <div className={classes.root}>
            <Button type="submit" variant="contained" className={classes.button} >
                Start the Search
            </Button>
            <Button variant="contained" className={classes.button} onClick={()=>props.feeling_lucky()}>
                I'm Feeling Lucky
            </Button>
        </div>
    );
}

Buttons.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Buttons);