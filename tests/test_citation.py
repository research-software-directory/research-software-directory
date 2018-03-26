import pytest
from app.citation import get_citation

def test_citation_notype():
    with pytest.raises(TypeError):
        get_citation('research-software-directory/frontend')



def test_bibtex():
    expected_data = \
'''@article{ITEM1, title={frontend},
journal={},
volume={},
number={},
pages={},
year={},
publisher={},
author={, }}'''

    mime_type, extension, data = get_citation('research-software-directory/frontend', 'bibtex')
    assert mime_type == 'application/x-bibtex'
    assert extension == 'bib'
    assert data == expected_data

@pytest.mark.skip(reason="citationcff is raising, because there is no DOI")
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
