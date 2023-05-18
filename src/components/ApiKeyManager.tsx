import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    makeStyles,
    Theme,
    IconButton,
    InputAdornment,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const LOCAL_STORAGE_KEY = 'openai-api-key';

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    footer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
    },
    textField: {
        width: '50%',
        marginRight: theme.spacing(2),
    },
}));

const ApiKeyManager: React.FC = () => {
    const classes = useStyles();
    const [apiKey, setApiKey] = useState('');
    const [storedKey, setStoredKey] = useState('');
    const [showPassword, setShowPassword] = useState(false); // state for showing/hiding password

    useEffect(() => {
        loadKey();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const saveKey = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, apiKey);
        setStoredKey(apiKey);
    };

    const removeKey = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setApiKey('');
        setStoredKey('');
    };

    const loadKey = () => {
        const key = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (key) {
            setApiKey(key);
            setStoredKey(key);
        }
    };

    return (
        <div className={classes.footer}>
            <TextField
                type={showPassword ? 'text' : 'password'} // toggle input type based on showPassword
                label="OpenAI API Key"
                variant="outlined"
                size="small"
                value={apiKey}
                onChange={handleChange}
                className={classes.textField}
                InputProps={{
                    // allows the password visibility toggle button to be an adornment on the text field
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword}>
                                {showPassword ? (
                                    <Visibility />
                                ) : (
                                    <VisibilityOff />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={saveKey}
                disabled={!apiKey || apiKey === storedKey}
            >
                Save Key
            </Button>
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={removeKey}
                disabled={!storedKey}
            >
                Remove Key
            </Button>
        </div>
    );
};

export default ApiKeyManager;
