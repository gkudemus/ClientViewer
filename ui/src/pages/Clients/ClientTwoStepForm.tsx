import { useState } from 'react';
import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
Stepper,
Step,
StepLabel,
TextField,
createTheme
} from '@mui/material';
import { withStyles } from '@mui/styles';
import StepIcon from '@mui/material/StepIcon';
import { ArrowBack } from '@mui/icons-material';
import { makeStyles, ThemeProvider } from '@mui/styles';
import { createClient } from "../../services/api";

const theme = createTheme({
});

const useStyles = makeStyles((theme) => ({
  formErrorMessage: {
    color: 'red'
  },
  button: {
    fontSize: 'xx-small',
    padding: '15px',
  },
  dialogueActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px'
  }
}));

const ClientTwoStepForm = ({ open, onClose, setIsDataUpdated }: {open: boolean, onClose: any, setIsDataUpdated: any})  => {
  const CustomStepIcon = withStyles(() => ({
    root: {
      '&$completed': {
        color: 'green',
      },
      '&$active': {
        color: 'gray',
      },
    },
    completed: {},
    active: {},
  }))(StepIcon);

  const [step, setStep] = useState(1);
  const [renderError, setRenderError] = useState(false)
  const [errorType, setErrorType] = useState('')
  const [data, setData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const classes = useStyles();

  const handleNextStep = () => {
    if(data.firstName && data.lastName) {
      setRenderError(false)
      setErrorType('')
      setStep(step + 1)
    }
    else {
      setRenderError(true)
      if(!data.firstName) setErrorType('First Name is Mandatory')
      if(!data.lastName) setErrorType('Last Name is Mandatory')
      if(!data.firstName && !data.lastName) setErrorType('Both First Name and Last Name are Mandatory')
    }
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const generateUserId = (format: string): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';  
    for (let i = 0; i < format.length; i++) {
      const char = format[i];
      if (char === '#') {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      } else {
        result += char;
      }
    }  
    return result;
  }

  const submitClientDetails = () => {
    try {
      if(data.email && data.phoneNumber) {
        onClose()
        const clientId = generateUserId('xx-aa-bb')
        setData({
          ...data,
          id: clientId
        })  
        createClient(data)
        setIsDataUpdated(true);
        setStep(1)
        setData({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: ''
        })
        setErrorType('')    
      } else {   
        setRenderError(true)
        if(!data.email) setErrorType('Email is Mandatory')
        if(!data.phoneNumber) setErrorType('Phone Number is Mandatory')
        if(!data.email && !data.phoneNumber) setErrorType('Both Email and Phone Number are Mandatory')
      }      
    } catch (error) {
      console.error('Error submitting form:', error);
    }    
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create new client</DialogTitle>
        <DialogContent>
          <Stepper activeStep={step}>
            <Step>
              <StepLabel StepIconComponent={CustomStepIcon}>Step 1</StepLabel>
            </Step>
            <Step>
              <StepLabel StepIconComponent={CustomStepIcon}>Step 2</StepLabel>
            </Step>
          </Stepper>
          {step === 1 && (
            <>
              <TextField
                label="First Name"
                name="firstName"
                value={data.firstName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={data.lastName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </>          
          )}
          {step === 2 && (
            <>
              <TextField
                label="Email"
                name="email"
                value={data.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={data.phoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            </>          
          )}
          {renderError && <h5 className={classes.formErrorMessage}>{errorType}</h5>}
        </DialogContent>
        <DialogActions className={classes.dialogueActions}>
          {step > 1 && (
            <Button onClick={handleBackStep} className={classes.button}><ArrowBack />Back</Button>
          )}
          {step < 2 ? (
            <div style={{ marginLeft: 'auto' }}>
              <Button variant="contained" color="primary" onClick={handleNextStep} className={classes.button}>Continue</Button>  
            </div>                
          ) : (
            <div style={{ marginLeft: 'auto' }}>
              <Button variant="contained" color="primary" onClick={submitClientDetails} className={classes.button}>Create Client</Button>   
            </div>               
          )}
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ClientTwoStepForm;