import { Octokit } from 'octokit';
import parseGhUrl from 'git-url-parse';

const getFileContent = async (
  repoLink: string,
  fileName: string,
  gitHubAccessToken?: string
) => {
  const octokit = new Octokit({
    auth: gitHubAccessToken,
  });

  const repoLinkData = parseGhUrl(repoLink);

  const fileContent = await octokit.rest.repos.getContent({
    owner: repoLinkData?.owner as string,
    repo: repoLinkData?.full_name.split('/')[1] as string,
    path: `docs/${fileName}`,
  });

  const decodedFileContent = Buffer.from(
    // @ts-ignore
    fileContent.data?.content,
    'base64'
  ).toString('utf8');

  return decodedFileContent;
};

export default getFileContent;
