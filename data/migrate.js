// organization
//db.organization.find().map(_=>_).forEach(org => {
//    db.organization.update({_id: org._id}, {
//        primaryKey: {
//            id: org.id,
//            collection: "organization"
//        },
//        createdAt:  org.createdAt,
//        updatedAt:  org.updatedAt,
//        name:       org.name,
//        url:        org.website
//    })
//})
//
//db.person.find().map(_=>_).forEach(person => {
//    db.person.update({_id: person._id}, {
//        primaryKey: {
//            id: person.id,
//            collection: "person"
//        },
//        createdAt:      person.createdAt,
//        updatedAt:      person.updatedAt,
//        emailAddress:   person.email,
//        familyNames:    person.name,
//        givenNames:     null,
//        nameParticle:   null,
//        nameSuffix:     null
//    })
//})

db.project.find().map(_=>_).forEach(project => {
    print(JSON.stringify(project.principalInvestigator));

//    db.project.update({_id: project._id}, {
//        primaryKey: {
//            id: project.id,
//            collection: "project"
//        },
//        foreignKeys: {
//            principalInvestigator: {
//                id:
//                collection: "person"
//            }
//        }
//        createdAt:      project.createdAt,
//        updatedAt:      project.updatedAt,
//        emailAddress: person.email,
//        familyNames: person.name,
//        givenNames: null,
//        nameParticle: null,
//        nameSuffix: null,
//    })
})