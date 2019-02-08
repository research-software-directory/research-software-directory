let get_repositories = (product_page) => {
    return product_page.repositoryURLs;
}

let get_number_of_repositories = (product_page) => {
    let n_repos = 0;
    let repotypes = Object.keys(product_page.repositoryURLs);
    for (let repotype of repotypes) {
        n_repos += product_page.repositoryURLs[repotype].length
    }
    return n_repos;
}
