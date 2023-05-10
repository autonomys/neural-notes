import React, { useState, useEffect } from 'react';
import { TextField, Button, makeStyles, Theme } from '@material-ui/core';

const LOCAL_STORAGE_KEY = 'openai-api-key';

const useStyles = makeStyles((theme: Theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    footer: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

const ApiKeyManager: React.FC = () => {
    const classes = useStyles();
    const [apiKey, setApiKey] = useState('');
    const [storedKey, setStoredKey] = useState('');

    useEffect(() => {
        loadKey();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
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
                fullWidth
                label="OpenAI API Key"
                variant="outlined"
                value={apiKey}
                onChange={handleChange}
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
