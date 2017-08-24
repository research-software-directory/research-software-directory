"""
Communication with Google Big Query (to get Github archived data)
"""

# def github_events(repo_url):
















"""
SELECT
  -- ISO 8601 formatted datetime string
  STRFTIME_UTC_USEC(created_at, "%Y-%m-%dT%H:%M:%SZ") AS created_at,
  type,
  repo.url,
  actor.url
FROM
  [githubarchive:year.2011],
  [githubarchive:year.2012],
  [githubarchive:year.2013],
  [githubarchive:year.2014],
  [githubarchive:year.2015]
WHERE
  repo.url = 'https://api.github.com/orgs/NLeSC'
"""