from pymongo import MongoClient
from dotenv import load_dotenv
import os
import requests
from datetime import datetime, timedelta


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


def check_price_alert(card, new_price):
    """Check if a price alert should be triggered for a card"""
    if not card.get("priceAlert", {}).get("enabled", False):
        return False

    target_price = card.get("priceAlert", {}).get("targetPrice")
    condition = card.get("priceAlert", {}).get("condition", "above")
    last_triggered = card.get("priceAlert", {}).get("lastTriggered")

    if not target_price or not new_price:
        return False

    try:
        current_price = float(new_price)
        target = float(target_price)
    except (ValueError, TypeError):
        return False

    # Check if alert was triggered recently (within last 24 hours)
    if last_triggered:
        if isinstance(last_triggered, str):
            last_triggered = datetime.fromisoformat(
                last_triggered.replace('Z', '+00:00'))
        if datetime.now() - last_triggered < timedelta(hours=24):
            return False

    # Check alert condition
    if condition == "above" and current_price >= target:
        return True
    elif condition == "below" and current_price <= target:
        return True

    return False


def create_notification(deck_id, card_name, current_price, target_price, condition):
    """Create a notification for a price alert"""
    message = f"{card_name} has {'reached' if condition == 'above' else 'dropped to'} ${current_price} (target: ${target_price})"

    notification = {
        "cardName": card_name,
        "message": message,
        "timestamp": datetime.now(),
        "read": False,
        "type": "price_alert"
    }

    # Add notification to deck
    decks.update_one(
        {"_id": deck_id},
        {"$push": {"notifications": notification}}
    )

    print(f"  🔔 ALERT: {message}")


for deck in decks.find():
    print(f"Updating deck: {deck.get('deckName', deck['_id'])}")
    updated_cards = []

    for card in deck.get("cards", []):
        old_price = card.get("price_usd")
        new_price = get_card_price(card["name"])
        card["price_usd"] = new_price

        # Check for price alerts
        if check_price_alert(card, new_price):
            target_price = card.get("priceAlert", {}).get("targetPrice")
            condition = card.get("priceAlert", {}).get("condition", "above")

            # Create notification
            create_notification(deck["_id"], card["name"],
                                new_price, target_price, condition)

            # Update last triggered timestamp
            card["priceAlert"]["lastTriggered"] = datetime.now()

        updated_cards.append(card)
        print(f"  {card['name']}: ${new_price}")

    decks.update_one({"_id": deck["_id"]}, {"$set": {"cards": updated_cards}})
    print(f"Finished updating deck: {deck.get('deckName', deck['_id'])}")

print("Done updating card prices.")
