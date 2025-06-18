from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)
db = client["CommanderDeckTuner"]
decks = db.decks


def migrate_deck_schema():
    """Add priceAlert fields to existing cards and notifications array to decks"""
    print("Starting deck schema migration...")

    updated_decks = 0
    updated_cards = 0

    for deck in decks.find():
        deck_updated = False

        # Add notifications array if it doesn't exist
        if "notifications" not in deck:
            deck["notifications"] = []
            deck_updated = True
            print(
                f"  Added notifications array to deck: {deck.get('deckName', deck['_id'])}")

        # Process each card in the deck
        if "cards" in deck:
            for card in deck["cards"]:
                # Add priceAlert object if it doesn't exist
                if "priceAlert" not in card:
                    card["priceAlert"] = {
                        "enabled": False,
                        "targetPrice": None,
                        "condition": "above",
                        "lastTriggered": None
                    }
                    deck_updated = True
                    updated_cards += 1

        # Save the deck if it was updated
        if deck_updated:
            decks.update_one({"_id": deck["_id"]}, {"$set": deck})
            updated_decks += 1
            print(f"  Updated deck: {deck.get('deckName', deck['_id'])}")

    print(f"\nMigration completed!")
    print(f"Updated {updated_decks} decks")
    print(f"Updated {updated_cards} cards")


if __name__ == "__main__":
    migrate_deck_schema()
