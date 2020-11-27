/* global db */

const migrate = () => {

    print('Migrating data 2.x to 3.0')

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
      $unset: {
        corporateUrl: '',
        principalInvestigator: ''
      }
    }

    db.project.updateMany(query, update)

    print('Migrating data 2.x to 3.0 ...Done')
}

migrate()
