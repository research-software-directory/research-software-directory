db.software.find().forEach(sw => {
  db.software.update({ _id: sw._id }, { $set: { repositoryURLs: { github: sw.repositoryURLs || [] } } }, { multi: true })
})