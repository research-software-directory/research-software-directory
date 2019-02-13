
// number of unique contributors
const contributors = new Set();
let add_contributors = (doc) => {
    doc.contributors.forEach((contributor) => {
        contributors.add(contributor.foreignKey.primaryKey.id)
    });
};
db.software_cache.find({"isPublished": true}).forEach(add_contributors);


// number of brands [with conceptdois]
let number_of_brands = db.software_cache.find({"isPublished": true}).count();
let brands_with_conceptdoi = db.software_cache.find({"isPublished": true}).map((doc) => {
    return doc.conceptDOI
}).filter((conceptdoi) => {
    return conceptdoi !== '10.0000/FIXME'
}).filter((conceptdoi) => {
    return conceptdoi !== null
})
let number_of_brands_with_conceptdoi = brands_with_conceptdoi.length;


// number of unique commits
let number_of_commits = 0;
let add_commits = (doc) => {
    let keys = Object.keys(doc.commits);
    for (let key of keys) {
        number_of_commits += doc.commits[key];
    }
};
db.software_cache.find({"isPublished": true}).forEach(add_commits);



// number of unique organizations
const organizations = new Set();
let add_organizations = (doc) => {
    doc.related.organizations.forEach((organization) => {
        organizations.add(organization.foreignKey.primaryKey.id)
    });
};
db.software_cache.find({"isPublished": true}).forEach(add_organizations);



// number of unique projects
const projects = new Set();
let add_projects = (doc) => {
    doc.related.projects.forEach((project) => {
        projects.add(project.foreignKey.primaryKey.id)
    });
};
db.software_cache.find({"isPublished": true}).forEach(add_projects);



// number of unique repositories
const repositories = new Set();
let add_repositories = (doc) => {
    for (let repotype in doc.repositoryURLs) {
        doc.repositoryURLs[repotype].forEach((repo_url) => {repositories.add(repo_url)})
    }
};
db.software_cache.find({"isPublished": true}).forEach(add_repositories);



// number of unique scientific publications
const scipubs = new Set();
let add_scipubs = (doc) => {
    doc.related.mentions.forEach((mention) => {
        if (mention.foreignKey.type == "conferencePaper" || mention.foreignKey.type == "journalArticle"  ) {
            scipubs.add(mention.foreignKey.primaryKey.id);
        };
    });
};
db.software_cache.find({"isPublished": true}).forEach(add_scipubs);



// number of unique mainstream media publications
const mmpubs = new Set();
let add_mmpubs = (doc) => {
    doc.related.mentions.forEach((mention) => {
        if (mention.foreignKey.type == "blogPost" || 
            mention.foreignKey.type == "interview" ||
            mention.foreignKey.type == "magazineArticle" ||
            mention.foreignKey.type == "newspaperArticle" ||
            mention.foreignKey.type == "radioBroadcast" ||
            mention.foreignKey.type == "videoRecording") {
            mmpubs.add(mention.foreignKey.primaryKey.id);
        };
    });
};
db.software_cache.find({"isPublished": true}).forEach(add_mmpubs);

var print_overview = () => {
    print("published brands:          " + number_of_brands)
    print("published brands with doi: " + number_of_brands_with_conceptdoi)
    print("contributors:              " + contributors.size)
    print("commits:                   " + number_of_commits)
    print("organizations:             " + organizations.size)
    print("projects:                  " + projects.size)
    print("repositories:              " + repositories.size)
    print("scipubs:                   " + scipubs.size)
    print("mmpubs:                    " + mmpubs.size)
}

print_overview()

