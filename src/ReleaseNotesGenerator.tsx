import React, { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    CssBaseline,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { generateInputData } from './github'; // Import generateInputData function

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
    startDate: string;
    endDate: string;
    additionalContext: string;
}

const ReleaseNotesGenerator: React.FC = () => {
    const classes = useStyles();
    const [formState, setFormState] = useState<FormState>({
        repoUrl: '',
        startDate: '',
        endDate: '',
        additionalContext: '',
    });

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof FormState
    ) => {
        setFormState({ ...formState, [field]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Use generateInputData function
        const inputData = await generateInputData(
            formState.repoUrl || 'https://github.com/subspace/subspace-cli',
            new Date(formState.startDate || '5/1/2023'),
            new Date(formState.endDate || '5/9/2023')
        );

        console.log(inputData);

        // Handle form submission logic here
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
                    Release Notes Generator
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
                        label="Start Date"
                        variant="outlined"
                        value={formState.startDate}
                        onChange={(event) => handleChange(event, 'startDate')}
                        className={classes.formElement}
                    />
                    <TextField
                        fullWidth
                        label="End Date"
                        variant="outlined"
                        value={formState.endDate}
                        onChange={(event) => handleChange(event, 'endDate')}
                        className={classes.formElement}
                    />
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
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
