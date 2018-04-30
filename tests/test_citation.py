import pytest
from app.citation import get_citation


def test_citation_notype():
    with pytest.raises(TypeError):
        get_citation('research-software-directory/frontend')


def test_bibtex():
    expected_data = \
'''@article{ITEM1, title={<a id="user-content-research-software-directory-frontend" class="anchor" aria-hidden="true" href="#research-software-directory-frontend"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>research-software-directory-frontend},
journal={},
volume={},
number={},
pages={},
year={},
publisher={}}'''

    mime_type, extension, data = get_citation('research-software-directory/frontend', 'bibtex')
    assert mime_type == 'application/x-bibtex'
    assert extension == 'bib'
    assert data == expected_data


def test_get_citation_cff_bibtex():
    mime_type, extension, data = get_citation('citationcff/citationcff', 'bibtex')
    assert mime_type == 'application/x-bibtex'
    assert extension == 'bib'


def test_get_citation_cff_enw():
    expected_data = \
'''%T Citationcff/Citationcff: Citationcff V0.0.0
%J 
%V 
%N 
%P 
%D 
%I Zenodo
0% Journal Article
%A Spaaks, Jurriaan H.
%A Klaver, Tom'''
    mime_type, extension, data = get_citation('citationcff/citationcff', 'enw')
    assert mime_type == 'application/x-endnote-refer'
    assert extension == 'enw'
    assert expected_data == data
