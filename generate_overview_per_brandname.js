// initialize overview variable
let overview = {};

// add keys, initialize as empty dict
let add_brandname = (doc) => {
    overview[doc.brandName.toLowerCase()] = {}
}
db.software_cache.find({"isPublished": true}).forEach(add_brandname);

// number of contributors
let add_contributors = (doc) => {
    overview[doc.brandName.toLowerCase()].contributors = doc.contributors.length
}
db.software_cache.find({"isPublished": true}).forEach(add_contributors);

// number of commits
let add_commits = (doc) => {
    let keys = Object.keys(doc.commits);
    let commits = 0;
    for (let key of keys) {
        commits += doc.commits[key];
    }
    overview[doc.brandName.toLowerCase()].commits = commits;
};
db.software_cache.find({"isPublished": true}).forEach(add_commits);


// number of organizations
let add_organizations = (doc) => {
    overview[doc.brandName.toLowerCase()].organizations = doc.related.organizations.length
}
db.software_cache.find({"isPublished": true}).forEach(add_organizations);

// number of projects
let add_projects = (doc) => {
    overview[doc.brandName.toLowerCase()].projects = doc.related.projects.length
}
db.software_cache.find({"isPublished": true}).forEach(add_projects);

// number of repositories
let add_repositories = (doc) => {
    overview[doc.brandName.toLowerCase()].repositories = 0;
    for (let repotype in doc.repositoryURLs) {
        overview[doc.brandName.toLowerCase()].repositories += doc.repositoryURLs[repotype].length
    }
}
db.software_cache.find({"isPublished": true}).forEach(add_repositories);

// number of scientific publications
let scipubs = new Set(["conferencePaper", "journalArticle"]);
let add_scipubs = (doc) => {
    overview[doc.brandName.toLowerCase()].scipubs = 0;
    doc.related.mentions.forEach((mention) => {
        if (scipubs.has(mention.foreignKey.type)) {
            overview[doc.brandName.toLowerCase()].scipubs += 1;
        };
    });
}
db.software_cache.find({"isPublished": true}).forEach(add_scipubs);

// number of mainstream media publications
let mmpubs = new Set(["blogPost",
                      "interview",
                      "magazineArticle", 
                      "newspaperArticle",
                      "radioBroadcast",
                      "videoRecording"]);
let add_mmpubs = (doc) => {
    overview[doc.brandName.toLowerCase()].mmpubs = 0;
    doc.related.mentions.forEach((mention) => {
        if (mmpubs.has(mention.foreignKey.type)) {
            overview[doc.brandName.toLowerCase()].mmpubs += 1;
        };
    });
}
db.software_cache.find({"isPublished": true}).forEach(add_mmpubs);

// number of publications (any type)
let add_totalpubs = (doc) => {
    overview[doc.brandName.toLowerCase()].totalpubs = 0;
    doc.related.mentions.forEach((mention) => {
        overview[doc.brandName.toLowerCase()].totalpubs += 1;
    });
}
db.software_cache.find({"isPublished": true}).forEach(add_totalpubs);

let print_overview = () => {
    print("brandName,contributors,commits,organizations,projects,scientific publications,mainstream media, total publications (any type)")
    Object.keys(overview).sort().forEach((key) => {
        print(key + ',' +
            overview[key].contributors + ',' + 
            overview[key].commits + ',' + 
            overview[key].organizations + ',' + 
            overview[key].projects + ',' + 
            overview[key].scipubs + ',' + 
            overview[key].mmpubs + ',' + 
            overview[key].totalpubs )
    })

}

print_overview()