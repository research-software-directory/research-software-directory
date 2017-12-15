/*** Copyright 2013 Teun Duynstee Licensed under the Apache License, Version 2.0 ***/
var firstBy=function(){function n(n){return n}function t(n){return"string"==typeof n?n.toLowerCase():n}function r(r,e){if(e="number"==typeof e?{direction:e}:e||{},"function"!=typeof r){var i=r;r=function(n){return n[i]?n[i]:""}}if(1===r.length){var u=r,o=e.ignoreCase?t:n;r=function(n,t){return o(u(n))<o(u(t))?-1:o(u(n))>o(u(t))?1:0}}return-1===e.direction?function(n,t){return-r(n,t)}:r}function e(n,t){var i="function"==typeof this&&this,u=r(n,t),o=i?function(n,t){return i(n,t)||u(n,t)}:u;return o.thenBy=e,o}return e}();
Vue.config.devtools = true;

function initOverview(softwareData) {
    var v = new Vue({
        el: '#overview',
        delimiters: ["[[", "]]"],
        methods: {
            log: console.log,
            showPage: function (n) {
                return n === 1 || n === this.lastPage || Math.abs(n - this.page) <= 2
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
                tags: []
            },
            sort: 'Last updated',
            pageSize: 10,
            page: 1,
            software: softwareData
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

                function filterSearch(searchTerm) {
                    return function (sw) {
                        if (!searchTerm) return true;
                        var fields = sw.name + " " + sw.tagLine + ' ' + sw.tags.join(" ");
                        return fields.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
                    }
                }

                return this.software
                    .filter(filterTags(this.filter.tags))
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

                if (this.sort === 'Last updated' && !this.filter.search && this.filter.tags.length === 0) {
                    return this.filteredSoftware.sort(firstBy(promoteHighlighted).thenBy(updatedSorter));
                } else {
                    return this.filteredSoftware.sort(sortFunction(this.sorts));
                }
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
            }
        },

        watch: {
            sort: {
                handler: function () { this.page = 1; } },
            filter: {
                handler: function () { this.page = 1; },
                deep: true
            }
        }
    });
}