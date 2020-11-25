/* global db */

const migrateProjectCollection = () => {
  print('migrating project collection...')

  const query = {}

  // Note: keys 'dataManagementPlanUrl', 'homeUrl', 'imageCaption', and
  // 'softwareSustainabilityPlanUrl' are purposely not set, as they are
  // not required. Users can still set them through the admin
  // interface if they want though.
  const update = {
    $set: {
      callUrl: 'https://doi.org/FIXME',
      codeUrl: 'https://github.com/FIXME',
      dateEnd: '1901-01-01',
      dateStart: '1900-01-01',
      description: 'FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME FIXME',
      grantId: 'FIXME',
      isPublished: true,
      'related.organizations': [],
      'related.projects': [],
      'related.software': [],
      tags: [],
      team: []
    },
    $rename: {
      image: 'imageUrl'
    },
    $unset: {
      corporateUrl: '',
      principalInvestigator: ''
    }
  }

  db.project.updateMany(query, update)

  print('migrating project collection...done')
}

const migrateOrganizationCollection = () => {
  print('migrating organization collection...')

  const query = {}

  const update = {
    $unset: {
      url: ''
    }
  }

  db.organization.updateMany(query, update)

  print('migrating organization collection...done')
}

const harmonizeProjectUrls = () => {
  // Make links to corporate site uniform
  // - only https links
  // - no www subdomain to esciencecenter.nl

  print('harmonizing project urls...')

  db.project.find({
    imageUrl: {
      $regex: '^http://www.esciencecenter.nl'
    }
  }).forEach((doc, idoc) => {
    doc.imageUrl = doc.imageUrl.replace('http://www.esciencecenter.nl', 'https://esciencecenter.nl')
    db.project.save(doc)
  })

  db.project.find({
    imageUrl: {
      $regex: '^https://www.esciencecenter.nl'
    }
  }).forEach((doc, idoc) => {
    doc.imageUrl = doc.imageUrl.replace('https://www.esciencecenter.nl', 'https://esciencecenter.nl')
    db.project.save(doc)
  })

  print('harmonizing project urls...done')
}

migrateProjectCollection()
harmonizeProjectUrls()
migrateOrganizationCollection()
