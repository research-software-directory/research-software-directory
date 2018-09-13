let get_projects = (product_page) => {
    return product_page.related.projects;
}

let get_number_of_projects = (product_page) => {
    return product_page.related.projects.length;
}
