import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Search from '@material-ui/icons/Search';
import Mic from "../Mic/Mic";






const styles = {
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 600,
        borderRadius: 32,
        boxShadow: 'none',
        borderWidth: 1,
        borderColor: '#dfe1e5',
        borderStyle: 'solid',
        transition: "all 0.1s cubic-bezier(.25,.8,.25,1)"
    },
    input: {
        marginLeft: 24,
        flex: 1,

    },
    iconButton: {
        padding: 10,
        marginRight: 2,
        color: "#4285f4"
},
    hover: {
        boxShadow: "0 1px 3px 2px rgba(0,0,0,0.1)"
    },


};

function MainSearch(props) {
    const {classes, redirectedQuery} = props;


    const [query, setQuery] = useState();


    const [hover, setHover] = useState(false);

    const update  = (value)=>{
        if(props.onQueryChange){
            props.onQueryChange(value);
            setQuery(value);
        }
    };


    const viewed_query = query!==undefined? query : redirectedQuery;

    return (
        <Paper className={`${classes.root} ${hover ? classes.hover : ''} ${props.className ? props.className : ''}`}
               elevation={1}
               onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        >
            <InputBase title="Search" className={classes.input} placeholder="Begin your search" value={viewed_query}
                       onChange={(event) => update(event.target.value)} />
            <Mic onMic={update}/>
            {props.className &&
                <IconButton type="submit" className={classes.iconButton}  aria-label="Search">
                    <Search/>
                </IconButton>

            }


        </Paper>
    );
}

MainSearch.propTypes = {
    classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(MainSearch);