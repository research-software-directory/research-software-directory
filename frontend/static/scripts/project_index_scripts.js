/* projects_scripts.js
 * This file runs on top of the software overview page (templates/project/project_index.html).
 * It is served as-is, so please keep everything ES5 compatible.
*/

/** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 **/
/** https://github.com/component/debounce **/
function debounce (n, l, u) {
  function t () {
    const c = Date.now() - r
    c < l && c >= 0 ? e = setTimeout(t, l - c) : (e = null, u || (i = n.apply(o, a), o = a = null))
  }
  let e, a, o, r, i
  null == l && (l = 100)
  const c = function () {
    o = this, a = arguments, r = Date.now()
    const c = u && !e
    return e || (e = setTimeout(t, l)), c && (i = n.apply(o, a), o = a = null), i
  }
  return c.clear = function () {
    e && (clearTimeout(e), e = null)
  }, c.flush = function () {
    e && (i = n.apply(o, a), o = a = null, clearTimeout(e), e = null)
  },
  c
}

function initOverview (projectsData, statusChoicesData) {
  const device = {
    phone: 'phone',
    tablet: 'tablet',
    desktop: 'desktop'
  }

  function getDevice () {
    return window.innerWidth > 1000 ? device.desktop : (window.innerWidth > 700 ? device.tablet : device.phone)
  }

  function filterStatuses (statuses) {
    return function (project) {
      return statuses.length === 0 || statuses.includes(project.status)
    }
  }

  function filterSearch (searchTerm) {
    return function (project) {
      if (!searchTerm) return true
      const fields = project.title + ' ' + project.subtitle
      return fields.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    }
  }

  const v = new Vue({
    el: '#project_index_page',
    delimiters: ['[[', ']]'],
    methods: {
      log: console.log,
      showPage: function (n) {
        return n === 1 || n === this.lastPage || Math.abs(n - this.page) <= 2
      },
      filtersBeforeEnter: function (el) {
        el.style.opacity = 0
        el.style.padding = 0
        el.style.maxHeight = 0
      },
      filtersEnter: function (el, done) {
        const delay = el.dataset.index * 20
        setTimeout(function () {
          el.style.opacity = 1
          el.style.maxHeight = '5em'
          el.style.removeProperty('padding')
        }, delay)
      },
      filtersBeforeLeave: function (el) {
        el.style.opacity = 1
        el.style.maxHeight = '5em'
      },
      filtersLeave: function (el, done) {
        const delay = el.dataset.index * 20
        setTimeout(function () {
          el.style.opacity = 0
          el.style.maxHeight = 0
          el.style.padding = 0
        }, delay)
      },
      setSorter: function (sorter) {
        this.sort = sorter
        this.sortersOpen = false
      }
    },
    data: {
      device: getDevice(),
      page: 1,
      projects: projectsData,
      statusChoices: statusChoicesData,
      mobShowFilters: false,
      filter: {
        search: '',
        statuses: []
      },
      statusesFilterOpen: getDevice() !== device.phone,
      sorters: ['Last updated', 'Most mentions'],
      sortersOpen: false,
      sort: 'Last updated'

    },
    computed: {
      statusesWithCount: function () {
        const initialValue = {}
        this.statusChoices.forEach(name => {
          initialValue[name] = 0
        })
        const counts = this.filteredProjects.map(d => d.status).reduce(
          (allStatuses, status) => {
            allStatuses[status]++
            return allStatuses
          },
          initialValue
        )
        return this.statusChoices.map(name => {
          return {
            name,
            count: counts[name]
          }
        })
      },
      filteredProjects: function () {
        return this.projects
          .filter(filterStatuses(this.filter.statuses))
          .filter(filterSearch(this.filter.search))
      },
      sortedProjects: function () {
        function updatedSorter (a, b) {
          return b.lastUpdate > a.lastUpdate ? 1 : (a.lastUpdate > b.lastUpdate ? -1 : 0)
        }
        function keyCountSorter (key) {
          return function (a, b) {
            return b[key] - a[key]
          }
        }
        function sortFunction (sortVal) {
          switch (sortVal) {
            case 'Last updated':
              return updatedSorter
            case 'Most mentions':
              return keyCountSorter('numMentions')
            default:
              return updatedSorter
          }
        }

        return this.filteredProjects.sort(sortFunction(this.sort))
      },
      pagedProjects: function () {
        const offset = this.pageSize * (this.page - 1)
        return this.sortedProjects.slice(offset, offset + this.pageSize)
      },

      lastPage: function () {
        return Math.ceil(this.filteredProjects.length / this.pageSize)
      },

      pageSize: function () {
        return {
          phone: 5,
          tablet: 10,
          desktop: 10
        }[this.device]
      }
    },
    watch: {
      page: {
        handler: function () { window.scrollTo(0, 0) }
      },
      sort: {
        handler: function () { this.page = 1 }
      },
      pageSize: {
        handler: function () { this.page = 1 }
      },
      filter: {
        handler: function () { this.page = 1 },
        deep: true
      },
      'filter.search': {
        handler: function () { gaSearch(this.filter.search) }
      }
    }
  })
  window.v = v
  window.addEventListener('resize', debounce(function (event) {
    v.device = getDevice()
  }, 200))
}

// Beamer Mode | Press 'Ctrl + b' to darken the grey backgrounds
// ---------------------------------------------------------------------
function KeyPress (e) {
  const bodyel = document.querySelector('body')
  const evtobj = window.event ? event : e
  if (evtobj.keyCode === 66 && evtobj.ctrlKey) {
    bodyel.classList.toggle('beamer-mode')
  }
}
document.onkeydown = KeyPress
