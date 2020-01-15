const update_shown = (elem, state) => {
   let siblings = [...elem.parentElement.children];
   siblings.forEach((sibling) => {
      sibling.classList.remove("selected");
   })
   elem.classList.add("selected");
   const id = elem.parentElement.parentElement.id;
   document.getElementById(id).getElementsByClassName(state.show)[0].classList.remove("hidden")
   state.hide.forEach((hidden) => {
      document.getElementById(id).getElementsByClassName(hidden)[0].classList.add("hidden")
   })
}


const shorten = (n) => {
   if (n >= 1e6) {
      return Math.floor(n / 1e6).toString(10) + "M";
   } else if (n >= 1e3) {
      return Math.floor(n / 1e3).toString(10) + "k";
   } else {
      return n.toString(10);
   }
}


const px = (n) => {
   return n.toString(10) + "px"
}


const prep_axes = (elem_id, bars) => {

   if (d3.select("#" + elem_id + " .graph").empty()) {
      // pass
   } else {
      d3.select("#" + elem_id).select("svg").remove()
   }

   const domains = {"x": [0, bars.length], "y": [0, Math.max(...bars)]};
   const margins = {"left": 45, "right": 45, "bottom": 60, "top": 60};
   const bbox = d3.select("#" + elem_id).node().getBoundingClientRect();
   const height = bbox.height;
   const width = bbox.width;
   const svg = d3.select("#" + elem_id + " .graph")
               .append("svg")
               .attr("width", px(width))
               .attr("height", px(height))
   const xscale = d3.scaleLinear().domain(domains.x).range([margins.left, width - margins.right]);
   const yscale = d3.scaleLinear().domain(domains.y).range([height - margins.bottom, margins.top]);

   const xlabel = svg.append("g")
                     .attr("class", "xlabel")
                        .append("text")
                        .attr("x", margins.left + (width - margins.left - margins.right) / 2)
                        .attr("y", height - margins.bottom * 0.5)

   const ylabel_transform = "translate(" +
                            (margins.left / 2).toString() +
                            ", "  +
                            (margins.top + (height - margins.top - margins.bottom) / 2).toString() +
                            ") " +
                            "rotate(270)";

   const ylabel = svg.append("g")
                     .attr("transform", ylabel_transform)
                     .attr("class", "ylabel")
                        .append("text")
                        .attr("x", 0)
                        .attr("y", 0)

   const title = svg.append("g")
                    .attr("class", "title")
                       .append("text")
                       .attr("x", margins.left + (width - margins.left - margins.right) / 2)
                       .attr("y", margins.top / 2)

   const bar_width = (width - margins.left - margins.right) / bars.length;

   const minimal_bar_height = 2; // for bars with value 0, show this many pixels tom indicate there is a bar.

   svg.selectAll("rect").data(bars).enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d, i) {
         return xscale(i);
      })
      .attr("y", function(d) {
         return yscale(d) + minimal_bar_height;
      })
      .attr("width", Math.max(1, bar_width - 2))
      .attr("height", function(d) {
         return Math.abs(yscale(d) - yscale(0)) + minimal_bar_height;
      })

   const first_bar = svg.append("text")
                        .attr("class", "bar-label")
                        .attr("x", xscale(0) + bar_width / 2)
                        .attr("y", yscale(bars[0]) - 5)
                        .text(shorten(bars[0]))

   const last_bar = svg.append("text")
                       .attr("class", "bar-label")
                       .attr("x", xscale(bars.length) - bar_width / 2)
                       .attr("y", yscale(bars[bars.length - 1]) - 5)
                       .text(shorten(bars[bars.length - 1]))

   return {xlabel, ylabel, title};
}


const unpublished = (item) => {
   return item.isPublished
};


const descending = (a, b) => {
   return b - a
}


const accumulate = (total, array_elem) => {
   return total + array_elem
};


const unique = (array_of_arrays) => {
   unique_entries = new Set();
   array_of_arrays.forEach((array) => {
      array.forEach((elem) => {
         unique_entries.add(elem)
      })
   })
   return unique_entries
};

const draw_packages = (items, id) => {
   const stat = shorten(items.filter(unpublished).length);
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_packages_doi = (items, id) => {
   const published = items.filter(unpublished);
   const citable = published.filter((item) => {
      return item.isCitable
   });
   const stat = Math.floor(100 * citable.length / published.length).toString(10) + "%";
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_permissive_licenses = (items, id) => {
   const permissive_license_types = new Set(["Apache-2.0",
                                             "GPL-2.0",
                                             "GPL-3.0",
                                             "LGPL-2.0",
                                             "LGPL-3.0",
                                             "MIT"])
   const published = items.filter(unpublished);
   const permissively_licensed = published.filter((item) => {
      return permissive_license_types.has(item.license[0])
   })
   const stat = Math.floor(100 * permissively_licensed.length / published.length).toString(10) + "%" ;
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_repositories = (items, id) => {
   const wrangle = (items) => {
   let add_repositories = (doc) => {
      let repositories = [];
      for (let repotype in doc.repositoryURLs) {
         doc.repositoryURLs[repotype].forEach((repo) => {
            repositories.push(repo)
         })
      }
      return repositories
   };
   const repositories = items.filter(unpublished).map(add_repositories);
   return shorten(unique(repositories).size)
   }
   const stat = wrangle(items);
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_projects = (items, id) => {
   const wrangle = (items) => {
      let add_projects = (doc) => {
         return doc.related.projects.map((project) => {
            return project.foreignKey.primaryKey.id
         });
      };
      const projects = items.filter(unpublished).map(add_projects);
      const bars = projects.map((project_array) => {return project_array.length}).sort(descending);
      const stat = shorten(unique(projects).size);
      return {bars, stat}
   }
   const {bars, stat} = wrangle(items);
   const {xlabel, ylabel, title} = prep_axes(id, bars);
   xlabel.text("software package");
   ylabel.text("count");
   title.text("Projects per software package");
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_contributors = (items, id) => {
   const wrangle = (items) => {
      let add_contributors = (doc) => {
         return doc.contributors.map((contributor) => {
            return contributor.foreignKey.primaryKey.id
         });
      };
      const contributors = items.filter(unpublished).map(add_contributors);
      const bars = contributors.map((contributor_array) => {return contributor_array.length}).sort(descending);
      const stat = shorten(unique(contributors).size);
      return {bars, stat}
   }
   const {bars, stat} = wrangle(items);
   const {xlabel, ylabel, title} = prep_axes(id, bars);
   xlabel.text("software package");
   ylabel.text("count");
   title.text("Contributors per software package");
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_commits = (items, id) => {
   const wrangle = (items) => {
      const add_commits = (doc) => {
         let number_of_commits = 0;
         let keys = Object.keys(doc.commits);
         for (let key of keys) {
            number_of_commits += doc.commits[key];
         }
         return number_of_commits;
      };
      const bars = items.filter(unpublished).map(add_commits).sort(descending);
      const stat = shorten(bars.reduce(accumulate));
      return {bars, stat}
   }
   const {bars, stat} = wrangle(items);
   const {xlabel, ylabel, title} = prep_axes(id, bars);
   xlabel.text("software packages");
   ylabel.text("count");
   title.text("Commits per software package");
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_organizations = (items, id) => {
   const wrangle = (items) => {
      let add_organizations = (doc) => {
         return doc.related.organizations.map((organization) => {
            return organization.foreignKey.primaryKey.id
         })
      }

      const organizations = items.filter(unpublished).map(add_organizations);
      const bars = organizations.map((elem) => {return elem.length}).sort(descending);
      const stat = shorten(unique(organizations).size);
      return {bars, stat}
   }
   const {bars, stat} = wrangle(items);
   const {xlabel, ylabel, title} = prep_axes(id, bars);
   xlabel.text("software package");
   ylabel.text("count");
   title.text("Organizations per software package");
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_publications_scientific = (items, id) => {
   const wrangle = (items) => {
      const add_scipubs = (doc) => {
         return doc.related.mentions.filter((mention) => {
            return scipub_types.has(mention.foreignKey.type)
         }).map((mention) => {
            return mention.foreignKey.primaryKey.id
         })
      };
      const scipub_types = new Set(["conferencePaper", "journalArticle"])
      const mentions = items.filter(unpublished).map(add_scipubs)
      const bars = mentions.map((elem) => {return elem.length}).sort(descending);
      const stat = shorten(unique(mentions).size);
      return {bars, stat}
   }
   const {bars, stat} = wrangle(items);
   const {xlabel, ylabel, title} = prep_axes(id, bars);
   xlabel.text("software package");
   ylabel.text("count");
   title.text("Scientific publications per software package");
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_publications_mainstream = (items, id) => {
   const wrangle = (items) => {
      const add_mmpubs = (doc) => {
         return doc.related.mentions.filter((mention) => {
            return mmpub_types.has(mention.foreignKey.type)
         }).map((mention) => {
            return mention.foreignKey.primaryKey.id
         })
      };
      const mmpub_types = new Set(["blogPost", "interview", "magazineArticle",
                                   "newspaperArticle", "radioBroadcast",
                                   "videoRecording"])
      const mentions = items.filter(unpublished).map(add_mmpubs)
      const bars = mentions.map((elem) => {return elem.length}).sort(descending);
      const stat = shorten(unique(mentions).size);
      return {bars, stat}
   }
   const {bars, stat} = wrangle(items);
   const {xlabel, ylabel, title} = prep_axes(id, bars);
   xlabel.text("software package");
   ylabel.text("count");
   title.text("Mainstream media publications per software package");
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}


const draw_publications_any = (items, id) => {
   const wrangle = (items) => {
      const add_allpubs = (doc) => {
         return doc.related.mentions.map((mention) => {
            return mention.foreignKey.primaryKey.id
         })
      };
      const mentions = items.filter(unpublished).map(add_allpubs)
      const bars = mentions.map((elem) => {return elem.length}).sort(descending);
      const stat = shorten(unique(mentions).size);
      return {bars, stat}
   }
   const {bars, stat} = wrangle(items);
   const {xlabel, ylabel, title} = prep_axes(id, bars);
   xlabel.text("software package");
   ylabel.text("count");
   title.text("Publications of any type per software package");
   document.getElementById(id).getElementsByClassName("number")[0].innerText = stat;
}

const url = 'https://www.research-software.nl/api/software_cache';
fetch(url)
.then((resp) => resp.json())
.then((items) => {

   const redraw = () => {
      draw_packages(items, "packages")
      draw_packages_doi(items, "packages-doi")
      draw_permissive_licenses(items, "permissive-licenses")
      draw_repositories(items, "repositories")
      draw_projects(items, "projects")
      draw_contributors(items, "contributors")
      draw_commits(items, "commits")
      draw_organizations(items, "organizations")
      draw_publications_scientific(items, "publications-scientific")
      draw_publications_mainstream(items, "publications-mainstream")
      draw_publications_any(items, "publications-any")
   }
   window.addEventListener("resize", redraw);
   redraw();

})
.catch(function(error) {
   console.log(JSON.stringify(error));
});
