/* step 3, remove items marked for deletion */
const idsToDelete = [
 "cerise-client",
 "twiqs.nl",
 "rdkit",
 "rascal",
 "monetdb",
 "dales",
 "cesium",
 "eecology-cartodb",
 "embem-ml-dataset",
 "langident",
 "mogli",
 "newsreader-component-wrappers",
 "newsreader-hadoop",
 "timbuctoo",
 "wps-configuration",
 "zerotier-portal-backend",
 "zerotier-portal",
 "potree",
 "couchdb"
];
db.software.deleteMany({'primaryKey.id': { '$in': idsToDelete }});
