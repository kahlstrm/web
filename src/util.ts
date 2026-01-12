import repoConfig from "./reposhowcase.json";
import { RepoResponse } from "./types";

export const fetchReposFromApi = async () => {
  const token = import.meta.env.GITHUB_TOKEN;
  const headers: HeadersInit = token
    ? {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      }
    : {};

  const reposhowcase = repoConfig.repos.map(async (n) => {
    const res = await fetch(`https://api.github.com/repos/${n}`, { headers });
    if (!res.ok) {
      console.error(`Error fetching repo: ${n}`);
      const data = await res.text();
      throw Error(`Couldn't fetch repo: ${n} - ${data}`);
    }
    return (await res.json()) as RepoResponse;
  });
  const responses = await Promise.all(reposhowcase);

  return { repos: responses, self: repoConfig.self };
};
