import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Logo from "../Home/Logo";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MainSearch from "../Home/MainSearch";
import {navigate} from "@reach/router";
import Typography from '@material-ui/core/Typography';
import CustomGrid from "./CustomGrid";
import axios from 'axios';


const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,

    },
    onlyBorder: {
        borderBottom: '1px solid #e8e8e8'
    },
    logoContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    search: {
        width: 690,
        marginRight: "24px",
    },
    searchBar: {
        display: "flex",
        alignItems: "center",

    },
    logo: {
        margin: 0,
        padding: 0,
        fontSize: "2em",
        display: "inline-block",

    },
    results: {
        paddingTop: "20px",
        marginLeft: "8px",
        maxWidth:"36%",
    },
    tabsRoot: {
        marginTop: "12px",
        borderBottom: '1px solid #e8e8e8',
    },

    tabsIndicator: {
        backgroundColor: '#1890ff',
    },
    tabRoot: {
        textTransform: 'initial',
        minWidth: 10,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    tabSelected: {},
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function search(query){
    try{
        const t = await axios.get(`/ranking?q=${encodeURI(query)}`);
        return t.data
    }
    catch(e){
        console.log(e);
        return []
    }
}

function ResultPage(props) {

    const [value, setValue] = useState(0);
    const [resultList, setResultList] = useState([]);
    const {classes} = props;
    const [queryTime, setqueryTime] = useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    const tabs = ['All', 'Images', 'News', 'Other'].map((str, i) => (
        <Tab
            disableRipple
            classes={{root: classes.tabRoot, selected: classes.tabSelected}}
            label={str}
            disabled={str !== 'All'}
            key={i}
        />
    ));

    let mQuery = getParameterByName("query");

    const reSearch = (event) => {
        navigate(`/search?query=${encodeURI(mQuery)}`);
        event.preventDefault();
        updateRes(mQuery);
    };

    useEffect( () => {
        // The second parameter as [] will result as componentDidMount
        // if the array is not empty it will be called when
        // its content will change as componentDidUpdate
        updateRes(mQuery);


    }, []);

    const updateRes = (mQuery)=>
        search(mQuery).then(({results, time})=>{
            setResultList(results);
            setqueryTime(`About ${results.length} results (${time} seconds)`)

        });


    const results = resultList.map((obj, i) => {
        const {title, uri, content} = obj;
        const resContent = content.split(' ').map((word)=>{
            if(mQuery.includes(word)){
                return <b>{word} </b>
            }
            return <span>{word} </span>
        });
        return <div className={classes.results} key={i}>
            <Typography style={{fontSize: 18}}>
                <span style={{color: "#1a0dab"}}>{title}</span>
            </Typography>
            <Typography gutterBottom>
                <span style={{color: "#006621"}}>{uri}</span>
            </Typography>
            <Typography component="p">
                <span style={{color: "#545454"}}>{resContent}</span>
            </Typography>
        </div>

    });


    return (
        <div className={classes.root}>
            <AppBar position="static" color="inherit" style={{boxShadow: "none", paddingTop: "20px"}}>
                <CustomGrid
                    left={<Logo className={classes.logo}/>}
                    leftClass={classes.logoContainer}
                    right={
                        <form onSubmit={reSearch}>
                            <MainSearch className={classes.search} redirectedQuery={getParameterByName("query")}
                                        onQueryChange={(q) => mQuery = q}/>
                        </form>
                    }
                    rightClass={classes.searchBar}

                />

                <CustomGrid
                    leftClass={classes.onlyBorder}
                    right={
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            classes={{root: classes.tabsRoot, indicator: classes.tabsIndicator}}>
                            {tabs}
                        </Tabs>
                    }
                />

                <CustomGrid right={
                    <div style={{marginBottom:"64px"}}>
                        <Typography component="p" color="textSecondary" style={{marginTop:"12px", marginLeft:"6px"}}>
                            {queryTime}
                        </Typography>
                        {results}
                    </div>}
                />

            </AppBar>

        </div>
    );
}


ResultPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultPage);