import axios, { AxiosResponse } from 'axios';

interface Label {
  name: string;
}

interface PullRequest {
  title: string;
  body: string;
  labels: Label[];
  closed_at: string;
}

interface ExtractedPRData {
  title: string;
  description: string;
  labels: string[];
}

async function fetchPRsBetweenDates(repoUrl: string, startDate: Date, endDate: Date): Promise<PullRequest[]> {
  const repoPath = repoUrl.replace('https://github.com/', '');
  const apiUrl = `https://api.github.com/repos/${repoPath}/pulls`;

  const fetchPRsByPage = async (currentPage: number): Promise<PullRequest[]> => {
    const params = {
      state: 'closed',
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
      page: currentPage,
    };

    const headers = {
      'Accept': 'application/vnd.github+json',
    };

    const response: AxiosResponse<PullRequest[]> = await axios.get(apiUrl, {
      params,
      headers,
    });

    return response.data;
  };

  const getAllPRs = async (currentPage: number, accumulatedPRs: PullRequest[]): Promise<PullRequest[]> => {
    const fetchedPRs: PullRequest[] = await fetchPRsByPage(currentPage);

    if (fetchedPRs.length === 0) {
      return accumulatedPRs;
    }

    const validPRs: PullRequest[] = fetchedPRs.filter((pr) => {
      const closedAt = new Date(pr.closed_at);
      return closedAt >= startDate && closedAt <= endDate;
    });

    return getAllPRs(currentPage + 1, [...accumulatedPRs, ...validPRs]);
  };

  return getAllPRs(1, []);
}

function filterPRs(prs: PullRequest[]): PullRequest[] {
  return prs.filter(pr => {
    return !pr.labels.some(label => label.name.toLowerCase() === 'documentation');
  });
}

function extractPRData(prs: PullRequest[]): ExtractedPRData[] {
  return prs.map(pr => {
    return {
      title: pr.title,
      description: pr.body,
      labels: pr.labels.map(label => label.name),
    };
  });
}

export async function generateInputData(repoUrl: string, startDate: Date, endDate: Date): Promise<ExtractedPRData[]> {
  const prs = await fetchPRsBetweenDates(repoUrl, startDate, endDate);
  const filteredPRs = filterPRs(prs);
  return extractPRData(filteredPRs);
}
