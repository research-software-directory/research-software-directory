import re
from bs4 import BeautifulSoup
import requests


class BlogScraper:
    def __init__(self, baseurl):
        if baseurl[-1] == "/":
            self.baseurl = baseurl
        else:
            self.baseurl = baseurl + "/"
        self.html = None
        self.soup = None
        self.posts = []

        self.get_document()
        self.make_soup()
        self.get_posts()

    def get_document(self):
        r = requests.get(self.baseurl)
        if r.status_code != 200:
            raise Exception("Something went wrong while retrieving the page.")
        else:
            self.html = r.text

    def make_soup(self):
        self.soup = BeautifulSoup(self.html, 'html.parser')

    def get_posts(self):
        postitems_soup = self.soup.find_all("div", class_="postItem")
        for idx, postitem_soup in enumerate(postitems_soup):

            post_id = postitem_soup.parent.attrs["data-post-id"]
            post_url = self.baseurl + post_id
            post_title = postitem_soup.string
            style_string = postitem_soup.find("a").attrs["style"]
            post_image = re.findall(r'"([^"]*)"', style_string)[0]
            post_datetime = postitem_soup.parent.parent.find('time').attrs['datetime']
            post_author = postitem_soup.parent.parent.find('div', class_='postMetaInline-authorLockup').find('a').text

            self.posts.append({
                "title": post_title,
                "id": post_id,
                "url": post_url,
                "image": post_image,
                "author": post_author,
                "datetime": post_datetime
            })

    def __str__(self):
        n_posts = len(self.posts)
        s = ""
        for post_index, post in enumerate(self.posts):
            s += "%d/%d: %s\n" % (post_index + 1, n_posts, post)
        return s


if __name__ == "__main__":

    scraper = Scraper(baseurl="https://blog.esciencecenter.nl/")
    print(scraper)

    print("Done.")
