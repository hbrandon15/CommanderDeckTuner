from pymongo import MongoClient
from dotenv import load_dotenv
import os
import requests


load_dotenv()  # Loads variables from .env into environment
mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)
db = client["CommanderDeckTuner"]
decks = db.decks


def get_card_price(card_name):
    url = f"https://api.scryfall.com/cards/named?exact={card_name}"
    resp = requests.get(url)
    if resp.status_code == 200:
        data = resp.json()
        return data.get("prices", {}).get("usd")  # or "usd_foil", etc.
    return None


for deck in decks.find():
    print(f"Updating deck: {deck.get('deckName', deck['_id'])}")
    updated_cards = []
    for card in deck.get("cards", []):
        price = get_card_price(card["name"])
        card["price_usd"] = price
        updated_cards.append(card)
        print(f"  {card['name']}: ${price}")
    decks.update_one({"_id": deck["_id"]}, {"$set": {"cards": updated_cards}})
    print(f"Finished updating deck: {deck.get('deckName', deck['_id'])}")

print("Done updating card prices.")
