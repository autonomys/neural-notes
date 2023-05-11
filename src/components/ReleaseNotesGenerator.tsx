import React, { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    CssBaseline,
    CircularProgress,
} from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import ApiKeyManager from './ApiKeyManager';
import { generateReleaseNotes } from '../release-notes';

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
    releaseNotes: {
        whiteSpace: 'pre-wrap',
        maxHeight: '300px', // set a maximum height
        overflowY: 'auto', // add a scrollbar
        padding: theme.spacing(4),
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
    const today = new Date();
    const defaultStartDate = new Date(
        today.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    const [formState, setFormState] = useState<FormState>({
        repoUrl: 'https://github.com/subspace/subspace-cli',
        startDate: defaultStartDate.toLocaleDateString(),
        endDate: today.toLocaleDateString(),
        additionalContext: '',
    });
    const [releaseNotes, setReleaseNotes] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof FormState
    ) => {
        setFormState({ ...formState, [field]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setLoading(true);
        const generatedReleaseNotes = await generateReleaseNotes(
            formState.repoUrl,
            new Date(formState.startDate),
            new Date(formState.endDate)
        );
        setLoading(false);

        // Update the releaseNotes state with the generated release notes
        setReleaseNotes(generatedReleaseNotes);
    };

    return (
        <>
            <CssBaseline />

            <Container maxWidth="md" className={classes.container}>
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
                    {/* <TextField
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
                    /> */}
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        className={`${classes.generateButton} ${classes.formElement}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Generate Release Notes'
                        )}
                    </Button>
                </form>
                {/* Add a new element to display the release notes */}
                {releaseNotes && (
                    <div className={classes.formElement}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Generated Release Notes:
                        </Typography>
                        <Typography
                            variant="body1"
                            className={classes.releaseNotes}
                        >
                            {releaseNotes}
                        </Typography>
                    </div>
                )}
            </Container>
            <ApiKeyManager />
        </>
    );
};

export default ReleaseNotesGenerator;
