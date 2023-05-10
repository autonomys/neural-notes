import { Octokit } from '@octokit/rest';
import { Endpoints } from '@octokit/types';

type PullRequest =
    Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'][0];
type Commit =
    Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/commits']['response']['data'][0];
type Comment =
    Endpoints['GET /repos/{owner}/{repo}/pulls/{pull_number}/comments']['response']['data'][0];

export interface ExtractedPRData {
    title: string;
    description: string | null;
    labels: string[];
    commits: string[];
    comments: string[];
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

async function fetchCommitsAndComments(
    repoUrl: string,
    pr: PullRequest,
    octokit: Octokit
): Promise<{ commits: Commit[]; comments: Comment[] }> {
    const [owner, repo] = extractOwnerAndRepo(repoUrl);

    const commits: Commit[] = await octokit.paginate(
        octokit.pulls.listCommits,
        {
            owner,
            repo,
            pull_number: pr.number,
            per_page: 100,
        }
    );

    const comments: Comment[] = await octokit.paginate(
        octokit.pulls.listReviewComments,
        {
            owner,
            repo,
            pull_number: pr.number,
            per_page: 100,
        }
    );

    return { commits, comments };
}

function filterPRs(prs: PullRequest[]): PullRequest[] {
    return prs.filter((pr) => {
        return !pr.labels.some(
            (label) => label.name.toLowerCase() === 'documentation'
        );
    });
}

async function extractPRData(
    repoUrl: string,
    prs: PullRequest[]
): Promise<ExtractedPRData[]> {
    const octokit = new Octokit();
    const result: ExtractedPRData[] = [];

    for (const pr of prs) {
        const { commits, comments } = await fetchCommitsAndComments(
            repoUrl,
            pr,
            octokit
        );
        result.push({
            title: pr.title!,
            description: pr.body,
            labels: pr.labels.map((label) => label.name),
            commits: commits.map((commit) => commit.commit.message),
            comments: comments.map((comment) => comment.body),
        });
    }

    return result;
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
    return extractPRData(repoUrl, filteredPRs);
}
