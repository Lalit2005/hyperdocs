import { Octokit } from 'octokit';
import parseGhUrl from 'parse-github-url';

const getAllFiles = async (repoLink: string, gitHubAccessToken?: string) => {
  const octokit = new Octokit({
    auth: gitHubAccessToken,
  });

  const repoUrl = repoLink as string;
  const repoLinkData = parseGhUrl(repoUrl);

  const files = await octokit.rest.repos.getContent({
    owner: repoLinkData?.owner as string,
    repo: repoLinkData?.repo?.split('/')[1] as string,
    path: 'docs',
  });

  return files;
};

export default getAllFiles;
