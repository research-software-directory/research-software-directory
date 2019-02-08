let get_mentions = (product_page) => {
    return product_page.related.mentions;
}

let get_number_of_mentions = (product_page) => {
    return product_page.related.mentions.length
}
