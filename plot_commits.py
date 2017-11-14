def ym2date(ym):
    if ym:
        y, m = divmod(ym, 12)
        return "{:4d}-{:d}".format(y, m+1)
    else:
        return None

def date2ym(date):
    if date:
        d = date.split('-')
        return 12 * int(d[0]) + int(d[1]) - 1
    else:
        return None

def bin_commits_data(json_data):
    binned_commits = {}
    for commit in json_data[0]['github']['commits']:
        d = date2ym(commit['date'][:7])
        if d in binned_commits:
            binned_commits[d] += 1
        else:
            binned_commits[d] = 1
    sorted_commits = sorted(binned_commits)
    x = []
    y = []
    for ym in range(min(binned_commits), max(binned_commits) + 1):
        x.append(ym2date(ym))
        y.append(binned_commits[ym] if ym in binned_commits else 0)
    data = [{
        'mode': 'lines',
        'x': x,
        'y': y,
        'line': {'shape': 'spline'},
        'fill': 'tonexty'}]
    return data


