db.software.updateOne(
  {"_id": "case-law-app"},
  { '$set': {
      'testimonials': [{
        "affiliation": "Professor of Private Law, Maastricht University",
        "person": "Gijs van Dijck",
        "text": "It’s quite amazing to see how, thanks to this tool, a student can, in some ways, outperform the expert."
      }]
    }
  }
);

db.software.updateOne(
  {"_id": "fastmlc"},
  { '$set': {
      'testimonials': [{
        "person": "Anonymous reviewer",
        "text": "A very nice tool to cluster and visualize sequences. The work is well presented, the web application easy to use and the manuscript well written."
      }]
    }
  }
);

db.software.updateOne(
  {"_id": "magma"},
  { '$set': {
      'testimonials': [{
        "affiliation": "Department of Civil & Environmental Engineering, Duke University",
        "person": "Lee Ferguson",
        "text": "My group has had an excellent run of almost 1 year now running MAGMa as part of our cluster-based compound ID workflow - it is really a great program."
      }]
    }
  }
);

db.software.updateOne(
  {"_id": "twinl-website-code"},
  { '$set': {
      'testimonials': [{
        "affiliation": "ictnieuws",
        "person": "Jan Lepeltak",
        "text": "biedt prachtige mogelijkheden voor onderzoeksvragen in de les"
      }]
    }
  }
);


db.software.updateOne(
  {"_id": "wadpac-ggir"},
  { '$set': {
      'testimonials': [{
        "affiliation": "Institute of Myology, Paris",
        "person": "Damien Bachasson",
        "text": "Thank you @vtvanhees for your work and support on the #GGIRpackage "
      }]
    }
  }
);
