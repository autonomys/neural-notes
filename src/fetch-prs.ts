import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';

type PullRequest =
    Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'][0];

interface ExtractedPRData {
    title: string;
    description: string | null;
    labels: string[];
}

async function fetchPRsBetweenDates(
    repoUrl: string,
    startDate: Date,
    endDate: Date
): Promise<PullRequest[]> {
    const [owner, repo] = extractOwnerAndRepo(repoUrl);
    const octokit = new Octokit();

    const prs: PullRequest[] = await octokit.paginate(octokit.pulls.list, {
        owner,
        repo,
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
    });

    return prs.filter((pr) => {
        const closedAt = new Date(pr.closed_at!);
        return closedAt >= startDate && closedAt <= endDate;
    });
}

function filterPRs(prs: PullRequest[]): PullRequest[] {
    return prs.filter((pr) => {
        return !pr.labels.some(
            (label) => label.name.toLowerCase() === 'documentation'
        );
    });
}

function extractPRData(prs: PullRequest[]): ExtractedPRData[] {
    return prs.map((pr) => {
        return {
            title: pr.title!,
            description: pr.body,
            labels: pr.labels.map((label) => label.name),
        };
    });
}

function extractOwnerAndRepo(repoUrl: string): [string, string] {
    const match = repoUrl.match(/github\.com\/([\w-]+)\/([\w-]+)/i);
    if (!match) {
        throw new Error('Invalid GitHub repository URL');
    }
    return [match[1], match[2]];
}

export async function generatePRInputData(
    repoUrl: string,
    startDate: Date,
    endDate: Date
): Promise<ExtractedPRData[]> {
    const prs = await fetchPRsBetweenDates(repoUrl, startDate, endDate);
    const filteredPRs = filterPRs(prs);
    return extractPRData(filteredPRs);
}
