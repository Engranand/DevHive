const axios = require('axios')

const GITHUB_API = 'https://api.github.com'
const REPO = 'Engranand/DevHive'

// GitHub token (optional)
const headers = process.env.GITHUB_TOKEN
  ? {
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }
  : {}

// Repo stats
const getRepoStats = async () => {
  const { data } = await axios.get(
    `${GITHUB_API}/repos/${REPO}`,
    { headers }
  )

  return {
    name: data.name,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    language: data.language,
    url: data.html_url,
    updatedAt: data.updated_at,
  }
}

// Recent commits
const getRecentCommits = async (limit = 5) => {
  const { data } = await axios.get(
    `${GITHUB_API}/repos/${REPO}/commits`,
    {
      params: { per_page: limit },
      headers
    }
  )

  return data.map(commit => ({
    sha: commit.sha.slice(0, 7),
    message: commit.commit.message.split('\n')[0],
    author: commit.commit.author.name,
    date: commit.commit.author.date,
    url: commit.html_url,
  }))
}

// Recent pull requests
const getRecentPRs = async (limit = 5) => {
  const { data } = await axios.get(
    `${GITHUB_API}/repos/${REPO}/pulls`,
    {
      params: {
        state: 'all',
        per_page: limit,
        sort: 'updated',
        direction: 'desc'
      },
      headers
    }
  )

  return data.map(pr => ({
    number: pr.number,
    title: pr.title,
    state: pr.merged_at ? 'merged' : pr.state,
    author: pr.user.login,
    url: pr.html_url,
    updatedAt: pr.updated_at,
  }))
}

module.exports = {
  getRepoStats,
  getRecentCommits,
  getRecentPRs
}