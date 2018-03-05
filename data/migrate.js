function convertDate(timestamp) {
    if (typeof timestamp === 'number') {
        return new Date(timestamp*1000).toISOString().substr(0,19)+'Z';
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
            createdAt: timestamp(),
            updatedAt: timestamp(),
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

db.software.find({primaryKey: { $exists: false }}).map(_=>_).forEach(sw => {
    db.software.update({_id: sw._id}, {
        primaryKey: {
            id: sw.id,
            collection: "software"
        },
        createdAt:              convertDate(sw.createdAt),
        updatedAt:              convertDate(sw.updatedAt),
        brandName:              sw.name,
        bullets:                sw.statement,
        citationcff:            null,
        contributors:           sw.contributor ? sw.contributor.map(c => mapContributors(c, sw)).filter(c=>c) : [],
        getStartedURL:          sw.mainUrl,
        githubURLs:             sw.githubid ? [{
            isCitationcffSource: false,
            isCommitDataSource: true,
            url: 'https://github.com/' + sw.githubid
        }] : [],
        isCitable:              false,
        isFeatured:             sw.highlighted || false,
        isPublished:            sw.published || false,
        license:                (sw.license && sw.license.length > 0) ? sw.license : [],
        programmingLanguage:    (sw.programmingLanguage && sw.programmingLanguage.length > 0) ? sw.programmingLanguage : [],
        readMore:               sw.readMore || null,
        shortStatement:         sw.shortStatement || null,
        slug:                   sw.id,
        tags:                   sw.tags || [],
        testimonial:            [],
        related: {
            software: !sw.relatedSoftware ? [] : sw.relatedSoftware.map(rel => ({
                foreignKey: {
                    id: rel,
                    collection: 'software'
                }
            }))
        }
    })
});



/* manually set: testimonial
> db.software.find({testimonial: { $exists: true, $ne: '' }}).map(s=>s.id + " " + s.testimonial + " ----- " + s.testimonialBy)
[
	"case-law-app It’s quite amazing to see how, thanks to this tool, a student can, in some ways, outperform the expert. ----- Gijs van Dijck, Professor of Private Law, Maastricht University",
	"fastmlc \"A very nice tool to cluster and visualize sequences. The work is well presented, the web application easy to use and the manuscript well written. \" ----- 'Anonymous reviewer'",
	"magma My group has had an excellent run of almost 1 year now running MAGMa as part of our cluster-based compound ID workflow - it is really a great program. ----- Lee Ferguson, Department of Civil & Environmental Engineering, Duke University",
	"twinl-website-code Twiqs.nl biedt prachtige mogelijkheden voor onderzoeksvragen in de les ----- Jan Lepeltak: http://ictnieuws.nl/columns/column-twinl-twitter-de-les/",
	"twiqs.nl Twiqs.nl biedt prachtige mogelijkheden voor onderzoeksvragen in de les ----- Jan Lepeltak, consultant Educational Technology",
	"wadpac-ggir Thank you @vtvanhees for your work and support on the #GGIRpackage ! ----- Damien Bachasson, Institute of Myology, Paris"
]
*/