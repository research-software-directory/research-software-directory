let get_commits = (product_page) => {
    return product_page.commits;
}

let get_number_of_commits = (product_page) => {
    let commits = 0;
    let keys = Object.keys(product_page.commits);
    for (let key of keys) {
        commits += product_page.commits[key];
    }
    return commits;
}

