
Possibly meaningful statistics:

- number of contributors
- number of commits
- number of lines committed
- number of repositories
- number of brands 
- number of organizations
- number of projects
- number of concept doi, versioned dois; number of related dois

Different ways to show each:

- per time period, e.g. over the last year
- trend: increase/decrease
- by whom? outside/organization
- data source: admin interface v GitHub API
- sum, mean, histogram/distribution

---

How many people have contributed code to what is currently in the Research Software Directory?

steps:

1. via mongo/pymongal, ask for the complete set of github repositories.

    ```javascript
    
    ```

1. use GitHub endpoint ``/repos/:owner/:repo/contributors`` to identify the contributors for each repo, e.g.
    
    ```bash
    curl -i 'https://api.github.com/repos/citation-file-format/cff-converter-python/contributors?client_id=xxxx&client_secret=yyyyy'
    ```


---

```
db.person.count()
101
db.commit.count()
0
db.mention.count()
655
```

# which RSD brands have associated blogs
```javascript
let f = (doc) => {
    doc.related.mentions.forEach((mention) => {
        if (mention.foreignKey.isCorporateBlog) {
            print(doc.brandName + ' has a blog.' )
        }
    })
};
db.software_cache.find({}).forEach(f)

```

# which RSD brands have associated papers or conference papers

```javascript
let f = (doc) => {
    doc.related.mentions.forEach((mention) => {
        if (mention.foreignKey.type == "conferencePaper" ) {
            print(doc.brandName)
        }
    })
};
db.software_cache.find({}).forEach(f)

```



