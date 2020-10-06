var query = {}

var update = {
    "$set": {
        "callUrl": "https://doi.org/FIXME",
        "codeUrl": "https://github.com/FIXME",
        "dataManagementPlanUrl": "",
        "dateEnd": "1901-01-01T00:00:00Z",
        "dateStart": "1900-01-01T00:00:00Z",
        "description": "FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME",
        "grantId": "FIXME",
        "homeUrl": "https://fixme.org",
        "imageCaption": "this is the image caption",
        "isPublished": false,
        "related.mentions": [],
        "related.organizations": [],
        "related.projects": [],
        "related.software": [],
        "softwareSustainabilityPlanUrl": "",
        "tags": [],
        "team": []
    },
    "$rename": {
        "image": "imageUrl"
    },
    "$unset": {
        "corporateUrl": "",
        "principalInvestigator": ""
    }
}

db.project.updateMany(query, update)
