db.software.update({}, { $set: { schema: 'software' }}, { multi: true });
db.software.updateMany({}, { $set: { schema: 'software' }}, { multi: true });

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


db.project.update({}, { $set: { schema: 'project' }}, { multi: true });
db.person.update({}, { $set: { schema: 'person' }}, { multi: true });
db.organization.update({}, { $set: { schema: 'organization' }}, { multi: true });
db.software.update({id: 'pyroot'}, {$set: { programmingLanguage: ['C++', 'Python'] }});
db.software.update({id: 'matrix-of-scatter'}, {$set: { programmingLanguage: ['Python'] }});
db.software.update({id: 'docker-couch-admin'}, {$set: { programmingLanguage: ['JavaScript', 'HTML'] }});
db.software.update({id: 'archimate'}, {$set: { programmingLanguage: [] }});
