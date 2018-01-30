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
'''%0
%0 Generic
%A Spaaks, Jurriaan H. & Klaver, Tom
%D 2018
%T citationcff
%E
%B
%C
%I GitHub repository
%V
%6
%N
%P
%&
%Y
%S
%7
%8 1
%9
%?
%!
%Z
%@
%(
%)
%*
%L
%M


%2
%3
%4
%#
%$
%F YourReferenceHere
%K "citation", "bibliography", "cff", "citationcff"
%X
%Z
%U https://github.com/citationcff/citationcff
'''
    mime_type, extension, data = get_citation('citationcff/citationcff', 'enw')
    assert mime_type == 'application/x-endnote-refer'
    assert extension == 'enw'
    assert data == expected_data
