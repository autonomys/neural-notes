// ReleaseNotesGenerator.tsx
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    CssBaseline,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        marginTop: theme.spacing(4),
    },
    formElement: {
        marginBottom: theme.spacing(2),
    },
    generateButton: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
}));

interface FormState {
    repoUrl: string;
    startRange: string;
    endRange: string;
    additionalContext: string;
}

const ReleaseNotesGenerator: React.FC = () => {
    const classes = useStyles();
    const [formState, setFormState] = useState<FormState>({
        repoUrl: '',
        startRange: '',
        endRange: '',
        additionalContext: '',
    });

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof FormState
    ) => {
        setFormState({ ...formState, [field]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log(formState);
    };

    return (
        <>
            <CssBaseline />
            <Container maxWidth="sm" className={classes.container}>
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                >
                    Neural Notes - Release Notes Generator
                </Typography>
                <Typography variant="subtitle1" align="center">
                    Generate release notes for your projects with ease.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Repository URL"
                        variant="outlined"
                        value={formState.repoUrl}
                        onChange={(event) => handleChange(event, 'repoUrl')}
                        className={classes.formElement}
                    />
                    <TextField
                        fullWidth
                        label="Start Commit/PR/Date"
                        variant="outlined"
                        value={formState.startRange}
                        onChange={(event) => handleChange(event, 'startRange')}
                        className={classes.formElement}
                    />
                    <TextField
                        fullWidth
                        label="End Commit/PR/Date"
                        variant="outlined"
                        value={formState.endRange}
                        onChange={(event) => handleChange(event, 'endRange')}
                        className={classes.formElement}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Additional Context (Optional)"
                        variant="outlined"
                        value={formState.additionalContext}
                        onChange={(event) =>
                            handleChange(event, 'additionalContext')
                        }
                        className={classes.formElement}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        className={`${classes.generateButton} ${classes.formElement}`}
                    >
                        Generate Release Notes
                    </Button>
                </form>
            </Container>
        </>
    );
};

export default ReleaseNotesGenerator;
