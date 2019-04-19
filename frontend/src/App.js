import React from 'react';
import './App.css';
import MainSearch from "./Home/MainSearch";
import Logo from "./Home/Logo";
import Buttons from "./Home/Buttons";
import {navigate, Router} from "@reach/router";
import ResultPage from "./Result/ResultPage";
import NotFound from "./errorPages/NotFound";


function App(props) {

    let mQuery = '';

    const handleSubmit = (event) => {
        navigate(`/search?query=${encodeURI(mQuery)}`);
        event.preventDefault() // do not reload
    };

    const handleLucky = (event)=>{
        window.location.href = 'https://www.google.co.uk/search?q='+encodeURI(mQuery);
        event.preventDefault()
    };

    const Home = () => (
        <div className="App">
            <div className="App-header">
                <Logo/>
                <form onSubmit={handleSubmit}>
                    <MainSearch onQueryChange={(q)=>mQuery=q}/>
                    <Buttons feeling_lucky={handleLucky}/>
                </form>
            </div>
            <div className="App-bar">The Inefficient Search Engine</div>
        </div>
    );

    const NoUrl = () => (
        <div className="App">
            <div className="App-header">
                <NotFound/>
            </div>
        </div>
    );

    return (
        <Router>
            <Home path="/"/>
            <ResultPage path="search"/>
            <NoUrl default/>
        </Router>
    );
}


//


export default App;
