from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

client = MongoClient(mongo_uri)
db = client["CommanderDeckTuner"]
decks = db.decks


def migrate_quantity_schema():
    """Add quantity field to existing cards"""
    print("Starting quantity schema migration...")

    updated_decks = 0
    updated_cards = 0

    for deck in decks.find():
        deck_updated = False

        # Process each card in the deck
        if "cards" in deck:
            for card in deck["cards"]:
                # Add quantity field if it doesn't exist
                if "quantity" not in card:
                    card["quantity"] = 1  # Default to 1
                    deck_updated = True
                    updated_cards += 1

        # Save the deck if it was updated
        if deck_updated:
            decks.update_one({"_id": deck["_id"]}, {"$set": deck})
            updated_decks += 1
            print(f"  Updated deck: {deck.get('deckName', deck['_id'])}")

    print(f"\nQuantity migration completed!")
    print(f"Updated {updated_decks} decks")
    print(f"Updated {updated_cards} cards")


if __name__ == "__main__":
    migrate_quantity_schema()
