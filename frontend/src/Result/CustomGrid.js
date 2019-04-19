import React from 'react';
import Grid from "@material-ui/core/Grid";


function CustomGrid(props) {

    return (
        <Grid container spacing={0}>
            <Grid item xs={4} sm={3} md={2} lg={1} xl={1} className={props.leftClass}>
                {props.left}
            </Grid>
            <Grid item xs={8} sm={9} md={10} lg={11} xl={11} className={props.rightClass}>
                 {props.right}
            </Grid>
        </Grid>
    );
}


export default CustomGrid;