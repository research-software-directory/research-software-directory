/* This converts RSD data from version 1 to version 2 */
function convertDate(timestamp) {
    if (typeof timestamp === 'number') {
        return new Date(timestamp*1000).toISOString().substr(0,19)+'Z';
    }
    else if (timestamp === "") {
        return new Date(timestamp()*1000).toISOString().substr(0,19)+'Z';
    }
    else {
        return timestamp;
    }
}

db.organization.find().map(_=>_).forEach(org => {
    db.organization.update({_id: org._id}, {
        primaryKey: {
            id: org._id,
            collection: "organization"
        },
        createdAt:  convertDate(org.createdAt),
        updatedAt:  convertDate(org.updatedAt),
        name:       org.name,
        url:        org.website
    })
})

db.person.find().map(_=>_).forEach(person => {
    db.person.update({_id: person._id}, {
        primaryKey: {
            id: person.id,
            collection: "person"
        },
        createdAt:      convertDate(person.createdAt),
        updatedAt:      convertDate(person.updatedAt),
        emailAddress:   person.email,
        familyNames:    person.name,
        givenNames:     null,
        nameParticle:   null,
        nameSuffix:     null
    })
})
const timestamp = () => Math.round(Date.now()/1000);

const mapContributors = (oldContributor, sw) => {
    if (typeof oldContributor === 'string') {
        if (db.person.findOne({_id: oldContributor})) {
            return ({
                foreignKey: {
                    collection: 'person',
                    id: oldContributor
                },
                isContactPerson: sw.contactPerson === oldContributor,
                affiliations: [ {
                    foreignKey: {
                        collection: 'organization',
                        id: 'nlesc'
                    }
                } ]
            });
        } else {
            print("Oops in " + sw.id);
            print("Contributor " + oldContributor.id + " could not be found in 'person' collection. skipping");
            return null;
        }
    } else {
        const id = ObjectId().str;
        const person = {
            _id: id,
            createdAt: convertDate(timestamp()),
            updatedAt: convertDate(timestamp()),
            primaryKey: {
                collection: "person",
                id: id
            },
            familyNames: oldContributor.name,
            emailAddress: oldContributor.email || null,
            givenNames: null,
            nameParticle: null,
            nameSuffix: null
        }
        db.person.insert(person);

        const affiliations = [];

        if (oldContributor.affiliation && oldContributor.affiliation.length > 0) {
            if (db.organization.findOne({_id: oldContributor.affiliation[0]})) {
                affiliations.push({
                    foreignKey: {
                        id: oldContributor.affiliation[0],
                        collection: 'organization'
                    }
                })
            } else {
                print("Oops in " + sw.id);
                print("Contributor " + oldContributor.name + " 's affiliation not found in 'organizations' collection, skipping");
            }
        }

        return ({
                foreignKey: {
                    collection: 'person',
                    id: id
                },
                isContactPerson: false,
                affiliations: affiliations
            });
    }
}

const projectIdRemap = {};
db.project.find({nlescWebsite: {'$ne': '', '$exists': true}}, {nlescWebsite:1}).forEach(r => projectIdRemap[r['_id']] = r['nlescWebsite'].substr(r['nlescWebsite'].lastIndexOf('/') + 1));

db.software.find({primaryKey: { $exists: false }}).map(_=>_).forEach(sw => {
    let relatedMentions = [];
    if (sw.zoteroKey) {
        let zoteroItem = db.zotero_publication.findOne({'key' : sw.zoteroKey});
        if (zoteroItem && 'dc:relation' in zoteroItem['data']['relations']) {
            let relations = zoteroItem['data']['relations']['dc:relation'];
            if (typeof relations === 'string') relations = [relations];
            relatedMentions = relations.map(mention => ({
                foreignKey: {
                    collection: 'mention',
                    id: mention.substr(-8)
                }
            }));
        }
    }

    db.software.update({_id: sw._id}, {
        primaryKey: {
            id: sw.id,
            collection: "software"
        },
        createdAt:              convertDate(sw.createdAt),
        updatedAt:              convertDate(sw.updatedAt),
        brandName:              sw.name,
        bullets:                sw.statement,
        conceptDOI:             sw.doi || null,
        contributors:           sw.contributor ? sw.contributor.map(c => mapContributors(c, sw)).filter(c=>c) : [],
        getStartedURL:          sw.mainUrl,
        repositoryURLs:         sw.githubid ? [
            'https://github.com/' + sw.githubid
        ] : [],
        isFeatured:             sw.highlighted || false,
        isPublished:            sw.published || false,
        license:                (sw.license && sw.license.length > 0) ? sw.license : [],
        programmingLanguage:    (sw.programmingLanguage && sw.programmingLanguage.length > 0) ? sw.programmingLanguage : [],
        readMore:               sw.readMore || null,
        shortStatement:         sw.shortStatement || null,
        slug:                   sw.id,
        tags:                   sw.tags || [],
        testimonials:            [],
        related: {
            software: !sw.relatedSoftware ? [] : sw.relatedSoftware.map(rel => ({
                foreignKey: {
                    id: rel,
                    collection: 'software'
                }
            })),
            mentions: relatedMentions,
            projects: (sw.usedInProject || []).map(project => ({
               foreignKey: {
                    id: projectIdRemap[project] ? projectIdRemap[project] : project,
                    collection: 'project'
               }
            })),
            organizations: sw.contributingOrganization
            ? sw.contributingOrganization.map(org => ({
                foreignKey: {
                    id: org,
                    collection: 'organization'
                }
              }))
            : []
        }
    })
});

db.software.updateMany({createdBy: null}, {$set: { createdBy: 'Unknown' }});
db.software.updateMany({updatedBy: null}, {$set: { updatedBy: 'Unknown' }});
db.person.updateMany({createdBy: null}, {$set: { createdBy: 'Unknown' }});
db.person.updateMany({updatedBy: null}, {$set: { updatedBy: 'Unknown' }});
db.organization.updateMany({createdBy: null}, {$set: { createdBy: 'Unknown' }});
db.organization.updateMany({updatedBy: null}, {$set: { updatedBy: 'Unknown' }});