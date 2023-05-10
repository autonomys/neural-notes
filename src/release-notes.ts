import * as dotenv from 'dotenv';
import { OpenAI } from 'langchain/llms/openai';
import { generatePRInputData } from './fetch-prs';

//dotenv.config();

export const generateReleaseNotes = async (
    repoUrl: string,
    startDate: Date,
    endDate: Date
) => {
    const openAIApiKey = localStorage.getItem('openai-api-key') || '';
    const model = new OpenAI({
        modelName: 'gpt-3.5-turbo',
        openAIApiKey: openAIApiKey,
    });

    const prs = JSON.stringify(
        await generatePRInputData(repoUrl, startDate, endDate)
    );
    const prompt = `Please generate release notes from the following pull request data:\n\n${prs}\n\nSummarize the main features, improvements, and bug fixes in the release."
`;
    console.log(prompt);
    return await model.call(prompt);
};
