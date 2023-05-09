import * as dotenv from 'dotenv';
import { OpenAI } from 'langchain/llms/openai';
import { generatePRInputData } from './fetch-prs';

dotenv.config();

const model = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    openAIApiKey: process.env.OPENAI_API_KEY,
});

export const generateReleaseNotes = async (
    repoUrl: string,
    startDate: Date,
    endDate: Date
) => {
    const prs = await generatePRInputData(repoUrl, startDate, endDate);
    const res = await model.call(
        "What's a good idea for an application to build with GPT-3?"
    );
    console.log(res);
};
