/* projects_scripts.js
 * This file runs on top of the software overview page (templates/project/project_index.html).
 * It is served as-is, so please keep everything ES5 compatible.
*/

/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
var firstBy=function(){function n(n){return n}function t(n){return"string"==typeof n?n.toLowerCase():n}function r(r,e){if(e="number"==typeof e?{direction:e}:e||{},"function"!=typeof r){var i=r;r=function(n){return n[i]?n[i]:""}}if(1===r.length){var u=r,o=e.ignoreCase?t:n;r=function(n,t){return o(u(n))<o(u(t))?-1:o(u(n))>o(u(t))?1:0}}return-1===e.direction?function(n,t){return-r(n,t)}:r}function e(n,t){var i="function"==typeof this&&this,u=r(n,t),o=i?function(n,t){return i(n,t)||u(n,t)}:u;return o.thenBy=e,o}return e}();
/*** https://github.com/component/debounce ***/
function debounce(n,l,u){function t(){var c=Date.now()-r;c<l&&c>=0?e=setTimeout(t,l-c):(e=null,u||(i=n.apply(o,a),o=a=null))}var e,a,o,r,i;null==l&&(l=100);var c=function(){o=this,a=arguments,r=Date.now();var c=u&&!e;return e||(e=setTimeout(t,l)),c&&(i=n.apply(o,a),o=a=null),i};return c.clear=function(){e&&(clearTimeout(e),e=null)},c.flush=function(){e&&(i=n.apply(o,a),o=a=null,clearTimeout(e),e=null)},c}

function initOverview(projectsData, statusChoicesData) {
    function sortByKey(key) {
        return function(a, b) { return a[key] - b[key]; }
    }

    var device = {
        phone: 'phone',
        tablet: 'tablet',
        desktop: 'desktop'
    };

    function getDevice() {
        return window.innerWidth > 1000 ? device.desktop : (window.innerWidth > 700 ? device.tablet : device.phone);
    }

    function filterStatuses(statuses) {
        return function(project) {
            return statuses.length === 0 || statuses.includes(project.status);
        }
    }

    function filterSearch(searchTerm) {
        return function (project) {
            if (!searchTerm) return true;
            var fields = project.title + " " + project.subtitle;
            return fields.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }
    }

    var v = new Vue({
        el: '#project_index_page',
        delimiters: ["[[", "]]"],
        methods: {
            log: console.log,
            setSorter: function(sorter) {
                this.sort = sorter;
                this.sortersOpen = false;
            },
            showPage: function (n) {
                return n === 1 || n === this.lastPage || Math.abs(n - this.page) <= 2
            },
            filtersBeforeEnter: function (el) {
                el.style.opacity = 0;
                el.style.padding = 0;
                el.style.maxHeight = 0;
            },
            filtersEnter: function(el, done) {
                var delay = el.dataset.index * 20;
                setTimeout(function () {
                    el.style.opacity = 1;
                    el.style.maxHeight = '5em';
                    el.style.removeProperty('padding');
                }, delay );
            },
            filtersBeforeLeave: function (el) {
                el.style.opacity = 1;
                el.style.maxHeight = '5em';
            },
            filtersLeave: function(el, done) {
                var delay = el.dataset.index * 20;
                setTimeout(function () {
                    el.style.opacity = 0;
                    el.style.maxHeight = 0;
                    el.style.padding = 0;
                }, delay );
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
            sort: 'Last updated',
        },
        computed: {
            statusesWithCount: function() {
                var initialValue = {};
                this.statusChoices.forEach(name => {
                    initialValue[name] = 0;
                });
                var counts = this.filteredProjects.map(d => d.status).reduce(
                    (allStatuses, status) => {
                        allStatuses[status]++;
                        return allStatuses;
                    },
                    initialValue
                );
                return this.statusChoices.map(name => {
                    return {
                        name,
                        count: counts[name]
                    }
                });
            },
            filteredProjects: function () {
                return this.projects
                    .filter(filterStatuses(this.filter.statuses))
                    .filter(filterSearch(this.filter.search));
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
                var offset = this.pageSize * (this.page - 1);
                return this.sortedProjects.slice(offset, offset + this.pageSize);
            },

            lastPage: function () {
                return Math.ceil(this.filteredProjects.length / this.pageSize);
            },

            pageSize: function() {
                return {
                    phone: 5,
                    tablet: 10,
                    desktop: 10
                }[this.device];
            }
        },
        watch: {
            page: {
                handler: function () { window.scrollTo(0,0); }
            },
            sort: {
                handler: function () { this.page = 1; }
            },
            pageSize: {
                handler: function () { this.page = 1; }
            },
            filter: {
                handler: function () { this.page = 1; },
                deep: true
            },
            'filter.search': {
                handler: function() { gaSearch(this.filter.search); }
            }
        }
    });
    window.v = v;
    window.addEventListener('resize', debounce(function(event) {
        v.device = getDevice();
    }, 200));
}

// Beamer Mode | Press 'Ctrl + b' to darken the grey backgrounds
// ---------------------------------------------------------------------
function KeyPress(e) {
    var bodyel = document.querySelector('body');
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 66 && evtobj.ctrlKey){
        bodyel.classList.toggle('beamer-mode');
    }
}
document.onkeydown = KeyPress;
