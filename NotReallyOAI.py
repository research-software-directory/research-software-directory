import xml.etree.ElementTree as ET
import requests
from datetime import datetime


def list_records():
    
    # get the conceptdois from /api/software
    response = requests.get('https://research-software.nl/api/software')
    conceptdois = [software["conceptDOI"] for software in response.json() if software["isPublished"]]

    # for each conceptdoi, get the datacite4 using Zenodo's OAI-PMH GetRecord
    list_records_document = ET.parse('ListRecords.template.xml')
    oaipmh_elem = list_records_document.getroot()

    for conceptdoi in conceptdois[:4]:
        
        response = requests.get('https://doi.org/{conceptdoi}'.format(conceptdoi=conceptdoi))
        identifier = response.url.split('/')[-1:][0]
        url = 'https://zenodo.org/oai2d?verb=GetRecord&identifier=oai:zenodo.org:' + identifier + '&metadataPrefix=datacite4'
        response = requests.get(url)
        # future work: correct/expand the datacite4 representation with other data from the RSDjson
        record = ET.fromstring(response.text)[2][0]
        oaipmh_elem[2].append(record)

    list_records_document.write('rsd-list-records-datacite4.xml')

    # (generate this mocked ListRecords result periodically from the tasks container, cache the result somehow)
    # 
    # create a route in frontend:
    # research-software.nl/oai-pmh?verb=ListRecords&metadataPrefix=datacite4
