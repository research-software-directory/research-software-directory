/* global db */

const data = [{
  dateEnd: '2021-08-19',
  dateStart: '2018-08-19',
  slug: 'abc-muse'
}]

data.forEach((d) => {
  const query = {
    slug: d.slug
  }
  const update = {
    $set: {
      dateEnd: d.dateEnd,
      dateStart: d.dateStart
    }
  }

  db.project.update(query, update)
})
