import logging

from src.database import db
from fuzzywuzzy import fuzz

logger = logging.getLogger(__name__)


def match_names(p1_full_name, p2_first_name, p2_last_name):
    """Match full name (person 1) against known first name & last name (person 2)"""
    p2_full_name = p2_first_name + ' ' + p2_last_name
    return max(fuzz.ratio(p2_full_name, p1_full_name), fuzz.ratio(p2_last_name, p1_full_name.split(" ")[-1]))


def author_map_suggestion(publication_id):
    publication = db.publication.find_one({'_id': publication_id})
    if not publication:
        raise Exception('publication not found: '+publication_id)

    people = list(db.person.find())
    mapping = []
    for creator in publication['creators']:
        for person in people:
            if match_names(person['name'], creator['firstName'], creator['lastName']) > 80:
                mapping.append(
                    {
                        'creator': creator,
                        'person': person['_id']
                    }
                )
                break

    return mapping


def get_mapping(publication_id):
    publication = db.publication.find_one({'_id': publication_id})
    if not publication:
        raise Exception('publication not found: ' + publication_id)

    mapping = db.publication_creator_person_map.find_one({'_id': publication_id})
    return mapping or {
        'id': publication_id,
        'mapping': author_map_suggestion(publication_id),
        'type': 'suggestion'
    }
