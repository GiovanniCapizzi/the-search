import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Microphone from '@material-ui/icons/Mic';
import SpeechRecognition from "react-speech-recognition";
import Tooltip from '@material-ui/core/Tooltip';


const options = {
    autoStart: false,
    continuous: false
};


const styles = {

    iconButton: {
        padding: 10,
        marginRight: 2,
        color: "#4285f4"
    },
    tooltip: {
        backgroundColor: '#263238',
        fontSize: 14,
    },
    micOn: {
        color: '#ffffff',
        backgroundColor: "#ef5350",

    }
};

function Mic(props) {
    const {classes, interimTranscript, listening, browserSupportsSpeechRecognition, startListening, stopListening} = props;
    if (!browserSupportsSpeechRecognition) {
        return;
    }

    const [voiceQuery, setVoiceQuery] = useState(false);

    if (interimTranscript && (voiceQuery !== interimTranscript) && props) {
        setVoiceQuery(interimTranscript);
        props.onMic(interimTranscript);
    }

    return (
        <Tooltip classes={{tooltip: classes.tooltip}} title="Search by voice" placement="bottom">
            <IconButton className={`${classes.iconButton} ${listening ? classes.micOn : ''}`} aria-label="Mic"
                        onClick={() => listening ? stopListening() : startListening()}>
                <Microphone/>
            </IconButton>
        </Tooltip>

    );
}

Mic.propTypes = {
    classes: PropTypes.object.isRequired,
    interimTranscript: PropTypes.string,
    startListening: PropTypes.func,
    stopListening: PropTypes.func,
    browserSupportsSpeechRecognition: PropTypes.bool,
    listening: PropTypes.bool

};

export default SpeechRecognition(options)(withStyles(styles)(Mic));