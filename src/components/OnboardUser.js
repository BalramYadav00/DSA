import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup, TextField } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Button } from '@mui/material';
import axios from 'axios';
const token = localStorage.getItem('red_wing_token');
const token_expiry_date = localStorage.getItem('red_wing_token_expiry_date');

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
		position: 'absolute'
	},
	hide_heading: {
		display: 'none'
	}
}));

const OnboardUser = () => {

    const [template, setTemplate] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const classes = useStyles();

    useEffect(() => {
		if (!token || token === 'undefined' || new Date(token_expiry_date) <= new Date()) {
			window.location.href = "https://launchpad.37signals.com/authorization/new?type=web_server&client_id=7d03697adc886996a673634b89d51d8febb29979&redirect_uri=https://touch-dashborad.herokuapp.com/auth/callback";
		}
	}, []);
  
    const handleSave = () => {
        console.log(template, name, email);
        setLoading(true);
        axios
        .get(`${process.env.REACT_APP_API_URL}/pages/add_user.php?name=${name}&email=${email}&template_id=${template}`,{
            headers: {
                Authorization: `${token}`,
                'Access-Control-Allow-Origin': '*'
            }
        })
        .then(data => {
            console.log(data.data);
            if(data.data.status){
                alert(data.data.msg);
                setEmail("");
                setName("");
                setTemplate("");
            }else{
                alert("Something went wrong");
            }
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setLoading(false);
        });
    }
    

    return (
        <div >
            <h1 className="text-center my-3" style={{ textAlign: 'center' }}> Assign project </h1>
            <div className='row d-flex justify-content-center'>
                <div className='col-md-7 mb-4'>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">Assign project</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue="female"
                            name="radio-buttons-group"
                            row
                            onChange={(e) => {setTemplate(e.target.value)}}
                            value={template}
                        >
                            <FormControlLabel value="21104017" control={<Radio />} label="Onboarding Project"  />
                            <FormControlLabel value="26942318" control={<Radio />} label="Test Project"  />
                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='col-md-7 pb-4 mb-4'>
                    <FormControl fullWidth>
                        <TextField id="outlined-basic" label="name" variant="standard" value={name} onChange={(e) => {setName(e.target.value)}} />
                    </FormControl>
                </div>
                <div className='col-md-7 pb-4 mb-4'>
                    <FormControl fullWidth>
                        <TextField id="outlined-basic" label="email" variant="standard" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                    </FormControl>
                </div>
               
                <div className='col-md-7 d-flex justify-content-center'>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </div>
            </div>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color='inherit' />
            </Backdrop>
        </div>
    )
}

export default OnboardUser;
