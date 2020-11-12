/* global db */

// Upgrade project datetime fields to dates
// Copy paste content of file in mongo shell with `docker-compose exec database mongo rsd`

const query = {
  dateStart: '1900-01-01T00:00:00Z'
}
const update = {
  $set: {
    dateEnd: '1901-01-01',
    dateStart: '1900-01-01'
  }
}

db.project.updateMany(query, update)

db.project.update({
  slug: 'abc-muse'
}, {
  $set: {
    dateEnd: '2021-08-19',
    dateStart: '2018-08-19'
  }
})
