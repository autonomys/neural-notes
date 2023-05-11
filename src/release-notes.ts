import { OpenAI } from 'langchain/llms/openai';

import { ExtractedPRData, generatePRInputData } from './fetch-prs';

const summarizePrs = async (prData: ExtractedPRData, model: OpenAI) => {
    const pr = JSON.stringify(prData);
    console.log(pr);
    const response = await model.call(
        `summarize the following PR for purposes of generating relase notes from an array of summaries:\n\n${JSON.stringify(
            pr
        )}`
    );
    console.log(response);
    console.log(`pr length ${pr.length} response length ${response.length}`);
    return response;
};

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

    const prs = await generatePRInputData(repoUrl, startDate, endDate);
    const summaries = await Promise.all(
        prs.map((pr) => summarizePrs(pr, model))
    );

    const prompt = `Please generate properly formatted in markdown release notes from the following pull request summaries:\n\n${JSON.stringify(
        summaries
    )}\n\n Categorize by new features, improvements, and bug fixes in the release. No need for details on PRs, just what is new for the user`;
    console.log(prompt);

    const response = await model.call(prompt);
    console.log(response);
    return response;
};
