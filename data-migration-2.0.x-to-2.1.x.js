var query = {}

var update = {
    "$set": {
        "callUrl": "https://doi.org/FIXME",
        "codeUrl": "https://github.com/FIXME",
        "dataManagementPlanUrl": "",
        "dateEnd": "1901-01-01T00:00:00",
        "dateStart": "1900-01-01T00:00:00",
        "description": "FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME",
        "grantId": "",
        "homeUrl": "https://fixme.org",
        "imageCaption": "",
        "isPublished": false,
        "related.mentions": [],
        "related.organizations": [],
        "related.projects": [],
        "related.software": [],
        "softwareSustainabilityPlan": "https://doi.org/fixme",
        "tags": [],
        "team": []
    },
    "$rename": {
        "image": "imageUrl"
    },
    "$unset": {
        "principalInvestigator": ""
    }
}

db.project.updateMany(query, update)