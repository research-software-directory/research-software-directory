var query = {}

// Note: keys 'dataManagementPlanUrl', 'homeUrl', 'imageCaption', and
// 'softwareSustainabilityPlanUrl' are purposely not set, as they are
// not required. Users can still set them through the admin
// interface if they want though.
var update = {
    "$set": {
        "callUrl": "https://doi.org/FIXME",
        "codeUrl": "https://github.com/FIXME",
        "dateEnd": "1901-01-01T00:00:00Z",
        "dateStart": "1900-01-01T00:00:00Z",
        "description": "FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME",
        "grantId": "FIXME",
        "isPublished": true,
        "related.organizations": [],
        "related.projects": [],
        "related.software": [],
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


// Make links to corporate site uniform
// - only https links
// - no www subdomain to esciencecenter.nl

db.project.find({
    "imageUrl": {
        $regex: "^http://www.esciencecenter.nl"
    }
}).forEach((doc, idoc) => {
    doc.imageUrl = doc.imageUrl.replace("http://www.esciencecenter.nl", "https://esciencecenter.nl")
    db.project.save(doc)
})

db.project.find({
    "imageUrl": {
        $regex: "^https://www.esciencecenter.nl"
    }
}).forEach((doc, idoc) => {
    doc.imageUrl = doc.imageUrl.replace("https://www.esciencecenter.nl", "https://esciencecenter.nl")
    db.project.save(doc)
})