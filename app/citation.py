from cff_converter_python import Citation
import requests


def get_mime_and_extension(format):
    if format == 'bibtex':
        return 'application/x-bibtex', 'bib'
    if format == 'enw':
        return 'application/x-endnote-refer', 'enw'
    if format == 'ris':
        return 'application/x-research-info-systems', 'ris'
    raise Exception('unknown format %s' % format)


def get_citation_data_cff(c, format):
    if format == 'bibtex':
        return c.as_bibtex()
    if format == 'enw':
        return c.as_enw()
    if format == 'ris':
        return c.as_ris()


def get_citation_data_citeas(github_id, format):
    url = 'http://api.citeas.org/product/https://github.com/%s' % github_id
    res = requests.get(url).json()
    return [value for value in res['exports'] if value['export_name'] == format][0]['export']


def get_citation(github_url, format):
    mime, extension = get_mime_and_extension(format)
    try:
        c = Citation(github_url)
    except:
        c = None

    if isinstance(c, Citation):
        data = get_citation_data_cff(c, format)
    else:
        data = get_citation_data_citeas(github_url, format)

    return mime, extension, data
