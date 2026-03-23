import json
import requests
import time
import csv
from pprint import pprint
from dataclasses import dataclass

from bs4 import BeautifulSoup

BASE_URL = "https://www.goodreads.com/quotes"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}


def save_to_json(data, filename):
    try:
        with open(filename, "w") as file:
            json.dump(data, file, indent=4)
            print(f"Data saved to {filename}")
    except Exception as e:
        print(f"Error occurred while saving to JSON: {e}")


def save_to_csv(quotes, filename):
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Text", "Author", "Tags", "Author Image", "Opus"])
        for quote in quotes:
            writer.writerow(
                [
                    quote.text,
                    quote.author,
                    ", ".join(quote.tags),
                    quote.author_image,
                    quote.opus,
                ]
            )


def get_tags():
    response = requests.get(BASE_URL, headers=HEADERS)
    soup = BeautifulSoup(response.content, "html.parser")

    tag_containers = soup.find_all("ul", class_="listTagsTwoColumn")

    tags = []

    for container in tag_containers:
        tags += [anchor["href"].split("/")[-1] for anchor in container.find_all("a")]

    return tags


@dataclass
class Quote:
    text: str
    author: str
    tags: list[str]
    author_image: str = ""
    opus: str = ""
    language: str = ""


def get_all_quotes_from_page(page=1, tag=None):
    url = f"{BASE_URL}/tag/{tag}?page={page}" if tag else f"{BASE_URL}?page={page}"
    print(f"Scraping {url}")

    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.content, "html.parser")

    quoteDivs = soup.find_all("div", class_="quoteDetails")

    quotes = []

    for quoteDiv in quoteDivs:

        text_div = quoteDiv.find("div", class_="quoteText")
        text = text_div.get_text(strip=True).split("”")[0] + "”"

        if len(text) == 0:
            continue

        author = (
            text_div.find("span", class_="authorOrTitle")
            .get_text(strip=True)
            .replace(",", "")
        )

        image_tag = quoteDiv.find("a", class_="leftAlignedImage")
        author_image = image_tag.img["src"] if image_tag and image_tag.img else ""

        tags_div = quoteDiv.find("div", class_="greyText smallText left")
        tags = (
            [tag.get_text(strip=True) for tag in tags_div.find_all("a")]
            if tags_div
            else []
        )

        opus_tag = text_div.find(
            "span", id=lambda x: x and x.startswith("quote_book_link_")
        )
        opus = opus_tag.a.get_text(strip=True) if opus_tag else ""

        new_quote = Quote(text, author, tags, author_image, opus)

        quotes.append(new_quote)

    return quotes


def get_first_hundred_page_quotes(tag=None):
    """
    1 to 100 because goodreads provides only 100 pages (3000 quotes)
    despite having more than 100 pages
    """
    quotes = []

    for page in range(1, 100):
        page_quotes = get_all_quotes_from_page(tag=tag, page=page)
        quotes += page_quotes
        time.sleep(1)

    return quotes


if __name__ == "__main__":

    # tags = get_tags()
    # save_to_json(tags, "tags.json")

    motivational_quotes = get_first_hundred_page_quotes(tag="motivational")
    # motivation_quotes = get_all_quotes(tag="motivation")

    save_to_csv(motivational_quotes, "motivational.csv")
