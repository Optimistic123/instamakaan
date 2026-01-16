import uuid
from typing import Dict, List, Optional
from modules.listings.schemas import ListingStatus

# In-memory store
_listings: Dict[str, dict] = {}

def create_listing():
    listing_id = str(uuid.uuid4())
    _listings[listing_id] = {
        "id": listing_id,
        "status": ListingStatus.DRAFT,
        "media": []
    }
    return _listings[listing_id]


def update_listing(listing_id: str, payload: dict):
    if listing_id not in _listings:
        return None

    _listings[listing_id].update(payload)
    return _listings[listing_id]
def validate_before_publish(listing: dict):
    required_fields = [
        "title",
        "listing_type",
        "city",
        "locality",
        "bhk",
        "beds",
        "baths",
        "area_sqft",
        "lat",
        "lng"
    ]

    for field in required_fields:
        if not listing.get(field):
            return False, f"{field} is required"

    if listing["listing_type"] not in ["RENT", "PRE_OCCUPIED", "BUY"]:
        return False, "Invalid listing_type"

    if listing["listing_type"] in ["RENT", "PRE_OCCUPIED"]:
        if not listing.get("rent_monthly") or not listing.get("deposit"):
            return False, "rent_monthly and deposit required"

    if listing["listing_type"] == "BUY":
        if not listing.get("sale_price"):
            return False, "sale_price required"

    media = listing.get("media", [])
    if len(media) == 0:
        return False, "At least 1 image is required"
    if len(media) > 5:
        return False, "Maximum 5 images allowed"

    for m in media:
        if not m.get("url"):
            return False, "Each media item must have a url"

    return True, None


def publish_listing(listing_id: str):
    listing = _listings.get(listing_id)
    if not listing:
        return None, "Listing not found"

    valid, error = validate_before_publish(listing)
    if not valid:
        return None, error

    cover = next((m["url"] for m in listing["media"] if m.get("is_cover")), None)
    listing["cover_image_url"] = cover or listing["media"][0]["url"]
    listing["status"] = ListingStatus.PUBLISHED

    return listing, None


def unpublish_listing(listing_id: str):
    listing = _listings.get(listing_id)
    if not listing:
        return None
    listing["status"] = ListingStatus.DRAFT
    return listing

def search_public_listings(
    listing_type: Optional[str] = None,
    city: Optional[str] = None,
    bhk: Optional[int] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    sort: Optional[str] = None,
    page: int = 1,
    limit: int = 10,
):
    results = [
        l for l in _listings.values()
        if l.get("status") == ListingStatus.PUBLISHED
    ]

    if listing_type:
        results = [l for l in results if l.get("listing_type") == listing_type]

    if city:
        results = [l for l in results if l.get("city") == city]

    if bhk:
        results = [l for l in results if l.get("bhk") == bhk]

    if min_price:
        results = [
            l for l in results
            if (l.get("rent_monthly") or l.get("sale_price", 0)) >= min_price
        ]

    if max_price:
        results = [
            l for l in results
            if (l.get("rent_monthly") or l.get("sale_price", 0)) <= max_price
        ]

    if sort == "newest":
        results = list(reversed(results))
    elif sort == "price_low":
        results.sort(key=lambda x: x.get("rent_monthly") or x.get("sale_price", 0))
    elif sort == "price_high":
        results.sort(
            key=lambda x: x.get("rent_monthly") or x.get("sale_price", 0),
            reverse=True
        )

    start = (page - 1) * limit
    end = start + limit
    return results[start:end]


def get_listing_by_id(listing_id: str):
    return _listings.get(listing_id)
