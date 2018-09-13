let get_contributors = (product_page) => {
    return product_page.contributors;
}

let get_number_of_contributors = (product_page) => {
    return product_page.contributors.length;
}

let retain_internal = (contributor) => {
    let fn = (affiliation) => {
        return affiliation.foreignKey.primaryKey.id
    };
    return contributor.affiliations.map(fn).includes('nlesc');
}