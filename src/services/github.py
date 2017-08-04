import datetime
import logging
import re

from github import Github
from tinydb import Query

from src import settings

logger = logging.getLogger(__name__)

GITHUB_INDEX_START_DATE = datetime.datetime(2012, 1, 1, 0, 0, 0)
ISO_DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%S'
ISO_DATETIME_FORMAT_TIMEZONE = '%Y-%m-%dT%H:%M:%SZ'

def total_count(paginated_list):
    pars = {} if paginated_list._PaginatedList__nextParams is None else paginated_list._PaginatedList__nextParams.copy()
    pars.update({"per_page" : 1, "page" : 1}) 
    headers = paginated_list._PaginatedList__requester.requestJsonAndCheck(
        "GET",
        paginated_list._PaginatedList__firstUrl,
        parameters=pars,
        headers=paginated_list._PaginatedList__headers
    )
    if not 'link' in headers:
        return 1
    return int(re.match(r'.*[&\?]page=(\d*).*?rel="last"', headers['link']).group(1))

def get_repository(software):
    if 'codeRepository' not in software or software['codeRepository'] is None:
        return None
    matches = re.match(r'https://github.com/(.*?)/?$', software['codeRepository'])
    return None if matches is None else matches.group(1)

def get_branch_data(repo):
    branches = repo.get_branches()
    master_branch = next(b for b in branches if b.name == 'master')
    return master_branch.commit.sha, total_count(branches)

def releases(repo):
    return [{
        "tagName"  : release.tag_name,
        "title"    : release.title,
        "date"     : datetime.datetime.strptime(
            release.raw_data['published_at'], ISO_DATETIME_FORMAT_TIMEZONE).isoformat(),
        "body"     : release.body
    } for release in repo.get_releases()]

def issues(repo):   
    return [{
        "body"          : issue.body,
        "createdAt"     : issue.created_at.isoformat(),
        "updatedAt"     : issue.updated_at.isoformat(),
        "closedAt"      : None if issue.closed_at is None else issue.closed_at.isoformat(),
        "state"         : issue.state,
        "userId"        : issue.user.id,
        "userName"      : issue.user.login
    } for issue in repo.get_issues()]

def get_commits(repo, sha, start_from):   
    commits = []
    for commit in repo.get_commits(since=start_from, sha=sha):
        # stats = commit.stats #stats add a request per commit (read: slow)
        commits.append({
            "sha"          : commit.sha,
            "date"         : commit.commit.committer.date.isoformat(),
            "userId"       : None if commit.committer is None else commit.committer.id,
            "userName"     : None if commit.committer is None else commit.committer.login,
            #"additions" : stats.additions,
            #"deletions" : stats.deletions,
            #"total"     : stats.total
        })

    logger.info("new commits: " + str(len(commits)))
    return commits

def has_commit_data(software):
    return 'github' in software and 'commits' in software['github']

def get_commit_start(software):
    return datetime.datetime.strptime(
        software['github']['commits'][0]['date'],
        ISO_DATETIME_FORMAT
    ) + datetime.timedelta(seconds=1)
    
def update_data(software, table):
    try:
        repository_name = get_repository(software)
        if repository_name is None:
            logger.warning("No github repository")
            return
        logger.info("Repository name: " + repository_name)
        g = Github(login_or_token=settings.GITHUB_ACCESS_TOKEN, per_page=100)
        repo = g.get_repo(repository_name)

        master_branch_sha, n_branches = get_branch_data(repo)

        old_commits = []
        if has_commit_data(software):
            commit_data_start = get_commit_start(software)
            old_commits = software['github']['commits']
        else:
            commit_data_start = GITHUB_INDEX_START_DATE
        commits = get_commits(repo, master_branch_sha, commit_data_start)

        data = {
            "description" : repo.description,
            "numBranches" : n_branches,
            "masterSHA"   : master_branch_sha,
            "commits"     : commits + old_commits,
            "releases"    : releases(repo),
            "issues"      : issues(repo),
            "stars"       : repo.stargazers_count,
            "watchers"    : repo.watchers_count,
            "forks"       : repo.forks_count,
            "pullRequests": total_count(repo.get_pulls())
        }

        q = Query()
        table.update({"github" : data}, q.id == software['id'])

    except Exception as e:
        logger.error("Error trying to update Github data")
        logger.exception(e)
