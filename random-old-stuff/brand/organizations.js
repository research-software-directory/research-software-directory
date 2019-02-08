let get_organizations = (product_page) => {
    return product_page.related.organizations;
}

let get_number_of_organizations = (product_page) => {
    return product_page.related.organizations.length;
}
