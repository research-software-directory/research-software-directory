import datetime

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
    for commit in json_data['github']['commits']:
        d = date2ym(commit['date'][:7])
        binned_commits[d] = binned_commits.get(d, 0) + 1
    x = []
    y = []
    current_ym = datetime.date.today().year * 12 + datetime.date.today().month
    for ym in range(current_ym - 60, current_ym):
        x.append(ym2date(ym))
        y.append(binned_commits[ym] if ym in binned_commits else 0)
    data = [{
        'mode': 'lines',
        'x': x,
        'y': y,
        'line': {'shape': 'spline'},
        'fill': 'tonexty'}]
    return data


