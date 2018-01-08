/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
var firstBy=function(){function n(n){return n}function t(n){return"string"==typeof n?n.toLowerCase():n}function r(r,e){if(e="number"==typeof e?{direction:e}:e||{},"function"!=typeof r){var i=r;r=function(n){return n[i]?n[i]:""}}if(1===r.length){var u=r,o=e.ignoreCase?t:n;r=function(n,t){return o(u(n))<o(u(t))?-1:o(u(n))>o(u(t))?1:0}}return-1===e.direction?function(n,t){return-r(n,t)}:r}function e(n,t){var i="function"==typeof this&&this,u=r(n,t),o=i?function(n,t){return i(n,t)||u(n,t)}:u;return o.thenBy=e,o}return e}();
/*** https://github.com/component/debounce ***/
function debounce(n,l,u){function t(){var c=Date.now()-r;c<l&&c>=0?e=setTimeout(t,l-c):(e=null,u||(i=n.apply(o,a),o=a=null))}var e,a,o,r,i;null==l&&(l=100);var c=function(){o=this,a=arguments,r=Date.now();var c=u&&!e;return e||(e=setTimeout(t,l)),c&&(i=n.apply(o,a),o=a=null),i};return c.clear=function(){e&&(clearTimeout(e),e=null)},c.flush=function(){e&&(i=n.apply(o,a),o=a=null,clearTimeout(e),e=null)},c}

var gaSearch = debounce(function(search) {
    if (window.ga) {
        ga.getAll()[0].send('event', 'search', search);
    }
}, 3000);

function initOverview(softwareData, organizationsData) {
    function sortByKey(key) {
        return function(a, b) { return a[key] - b[key]; }
    }

    function hasKey(key) {
        return function(a) { return a.hasOwnProperty(key); }
    }

    var device = {
        phone: 'phone',
        tablet: 'tablet',
        desktop: 'desktop'
    };

    function getDevice() {
        return window.innerWidth > 1000 ? device.desktop : (window.innerWidth > 700 ? device.tablet : device.phone);
    }

    var v = new Vue({
        el: '#overview',
        delimiters: ["[[", "]]"],
        methods: {
            log: console.log,
            showPage: function (n) {
                return n === 1 || n === this.lastPage || Math.abs(n - this.page) <= 2
            },
            getOrganizationById: function(id) {
                return this.organizations.find(function(org) { return org.id === id; });
            }
        },
        data: {
            tags: [
                "Visualization",
                "Image processing",
                "Machine learning",
                "Text analysis & natural language processing",
                "Real time data analysis",
                "Optimized data handling",
                "Big data",
                "Inter-operability & linked data",
                "Multi-scale & multi model simulations",
                "High performance computing",
                "GPU",
                "Workflow technologies"
            ],
            filter: {
                search: '',
                tags: [],
                organizations: []
            },
            sort: 'Last updated',
            device: getDevice(),
            page: 1,
            software: softwareData,
            organizations: organizationsData
        },
        computed: {
            tagCount: function () {
                // initialize to 0
                var counts = this.tags.reduce(function (acc, cur) {
                    acc[cur] = 0;
                    return acc;
                }, {});
                this.software.forEach(function (sw) {
                    sw.tags.forEach(function (tag) {
                        counts[tag] += 1;
                    });
                });
                return counts;
            },

            organizationsWithCount: function () {
                var counts = JSON.parse(JSON.stringify(this.organizations));
                this.software.forEach(function (sw) {
                    sw.contributingOrganization.forEach(function (orgId) {
                        var org = counts.find(function(corg) { return corg.id === orgId });
                        if (org) {
                            org['count'] = (org['count'] || 0) + 1;
                        }
                    });
                });

                return counts.filter(hasKey('count')).sort(sortByKey('count')).reverse();
            },



            filteredSoftware: function () {
                function filterTags(tags) {
                    return function (sw) {
                        if (tags.length === 0) return true;
                        var match = false;
                        sw.tags.forEach(function (tag) {
                            if (tags.includes(tag)) {
                                match = true;
                            }
                        });
                        return match;
                    }
                }

                function filterOrganizations(orgs) {
                    return function(sw) {
                        if (orgs.length === 0) return true;
                        var match = false;
                        sw.contributingOrganization.forEach(function (org) {
                            if (orgs.includes(org)) {
                                match = true;
                            }
                        });
                        return match;
                    }
                }

                function filterSearch(searchTerm) {
                    return function (sw) {
                        if (!searchTerm) return true;
                        var fields = sw.name + " " + sw.tagLine + ' ' + sw.tags.join(" ");
                        return fields.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
                    }
                }



                return this.software
                    .filter(filterTags(this.filter.tags))
                    .filter(filterOrganizations(this.filter.organizations))
                    .filter(filterSearch(this.filter.search));
            },

            sortedSoftware: function () {
                function updatedSorter(a, b) {
                    return b.lastUpdate - a.lastUpdate;
                }

                function promoteHighlighted(a, b) {
                    if (a.highlighted && b.highlighted) return 0;
                    else if (a.highlighted) return -1;
                    else if (b.highlighted) return 1;
                    return 0;
                }

                function sortFunction(sortVal) {
                    switch (sortVal) {
                        case 'Last updated':
                            return updatedSorter;
                        default:
                            return updatedSorter;
                    }
                }

                return this.filteredSoftware.sort(firstBy(promoteHighlighted).thenBy(updatedSorter));

                // if (this.sort === 'Last updated' && !this.filter.search && this.filter.tags.length === 0) {
                //     return this.filteredSoftware.sort(firstBy(promoteHighlighted).thenBy(updatedSorter));
                // } else {
                //     return this.filteredSoftware.sort(sortFunction(this.sorts));
                // }
            },

            pagedSoftware: function () {
                var offset = this.pageSize * (this.page - 1);
                return this.sortedSoftware.slice(offset, offset + this.pageSize);
            },

            lastPage: function () {
                return Math.ceil(this.filteredSoftware.length / this.pageSize);
            },

            searchFields: function () {
                this.software.map(function (sw) {
                    return "test";
                });
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
            sort: {
                handler: function () { this.page = 1; } },
            pageSize: {
                handler: function () { this.page = 1; } },
            filter: {
                handler: function () { this.page = 1; },
                deep: true
            },
            'filter.search': {
                handler: function() { gaSearch(this.filter.search); }
            }
        }
    });

    window.addEventListener('resize', debounce(function(event) {
        v.device = getDevice();
    }, 200));


}