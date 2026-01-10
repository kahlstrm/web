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

  const reposhowcase = repoConfig.repos.map((n) =>
    fetch(`https://api.github.com/repos/${n}`, { headers }).then((res) => {
      if (!res.ok) {
        console.error(`Error fetching repo: ${n}`);
        res.text().then((data) => {
          throw Error(`Couldn't fetch repo: ${n} - ${data}`);
        });
      }

      return res.json().then((data) => data as RepoResponse);
    }),
  );
  const responses = await Promise.all(reposhowcase);

  return { repos: responses, self: repoConfig.self };
};
