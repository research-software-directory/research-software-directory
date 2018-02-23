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

db.software.find().map(_=>_).forEach(sw => {
    db.software.update({_id: sw._id}, {
        primaryKey: {
            id: sw.id,
            collection: "software"
        },
        createdAt:      sw.createdAt,
        updatedAt:      sw.updatedAt,
        brandName:      sw.name,
        bullets:        "",
        citationcff:    null
    })
})
