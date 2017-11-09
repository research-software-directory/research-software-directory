db.software.updateMany({}, { $set: { schema: 'software' }});
db.software.updateMany({}, { $set: { schema: 'software' }});

db.software.find().snapshot().forEach(
    function (elem) {
        db.software.update(
            {
                _id: elem._id
            },
            {
                $set: {
                    usingOrganization: elem.user
                }
            }
        );
    }
);


db.project.updateMany({}, { $set: { schema: 'project' }});
db.person.updateMany({}, { $set: { schema: 'person' }});
db.organization.updateMany({}, { $set: { schema: 'organization' }});
db.software.update({id: 'pyroot'}, {$set: { programmingLanguage: ['C++', 'Python'] }});
db.software.update({id: 'matrix-of-scatter'}, {$set: { programmingLanguage: ['Python'] }});
db.software.update({id: 'docker-couch-admin'}, {$set: { programmingLanguage: ['JavaScript', 'HTML'] }});
db.software.update({id: 'archimate'}, {$set: { programmingLanguage: [] }});

