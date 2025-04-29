import requests
import random
from typing import List, Dict, Any

user_id = "Ll0KLLTEVyXaiZCNaWWQfafQJkf2"
vendor_name = "Booking.com"

def generate_hotels() -> List[Dict[str, Any]]:
    hotel_chains = ["Marriott", "Hilton", "Hyatt"]
    locations = ["New York", "San Francisco", "Los Angeles"]
    room_types = ["Standard", "Deluxe", "Executive"]
    
    products = []
    for chain in hotel_chains:
        for location in locations:
            for room_type in room_types:
                base_price = random.randint(100, 500)
                products.append({
                    "userId": user_id,
                    "name": f"{chain} {location} - {room_type}",
                    "description": f"Experience luxury at {chain} {location}. This {room_type.lower()} room offers premium amenities and services.",
                    "price": base_price,
                    "type": "hotel",
                    "vendorName": vendor_name,
                    "metadata": {
                        "chain": chain,
                        "location": location,
                        "roomType": room_type,
                        "bedrooms": "1",
                        "bathrooms": "1",
                        "size": str(random.randint(300, 600)),
                        "amenities": "WiFi, TV, Mini-bar, Room Service",
                        "breakfast": "Included" if random.random() > 0.5 else "Not included",
                        "rating": str(random.randint(3, 5)),
                        "cancellationPolicy": "Flexible" if random.random() > 0.5 else "Strict"
                    }
                })
    return products

def generate_apartments() -> List[Dict[str, Any]]:
    locations = ["New York", "San Francisco", "Los Angeles"]
    apartment_types = ["Studio", "1-Bedroom", "2-Bedroom"]
    
    products = []
    for location in locations:
        for apt_type in apartment_types:
            base_price = random.randint(80, 400)
            products.append({
                "userId": user_id,
                "name": f"{apt_type} in {location}",
                "description": f"Modern {apt_type.lower()} apartment in the heart of {location}. Perfect for both short and long stays.",
                "price": base_price,
                "type": "apartment",
                "vendorName": vendor_name,
                "metadata": {
                    "location": location,
                    "apartmentType": apt_type,
                    "bedrooms": str(apt_type.split('-')[0] if '-' in apt_type else "0"),
                    "bathrooms": str(random.randint(1, 3)),
                    "size": str(random.randint(500, 2000)),
                    "amenities": "Kitchen, WiFi, Washer/Dryer, TV",
                    "minimumStay": str(random.randint(1, 30)) + " nights",
                    "rating": str(random.randint(3, 5)),
                    "elevator": "Yes" if random.random() > 0.3 else "No",
                    "parking": "Available" if random.random() > 0.5 else "Not available"
                }
            })
    return products

def generate_vacation_rentals() -> List[Dict[str, Any]]:
    property_types = ["Beach House", "Mountain Cabin", "Lake House", "Villa", "Country House"]
    locations = ["Miami", "Aspen", "Lake Tahoe", "Tuscany", "Bali", "Phuket"]
    
    products = []
    for prop_type in property_types:
        for location in locations:
            base_price = random.randint(150, 800)
            products.append({
                "userId": user_id,
                "name": f"{prop_type} in {location}",
                "description": f"Stunning {prop_type.lower()} in {location}. Perfect for family vacations or group getaways.",
                "price": base_price,
                "type": "vacation_rental",
                "vendorName": vendor_name,
                "metadata": {
                    "propertyType": prop_type,
                    "location": location,
                    "bedrooms": str(random.randint(2, 6)),
                    "bathrooms": str(random.randint(2, 4)),
                    "size": str(random.randint(1000, 4000)),
                    "amenities": "Pool, Hot Tub, BBQ, Full Kitchen, WiFi",
                    "minimumStay": str(random.randint(3, 7)) + " nights",
                    "rating": str(random.randint(3, 5)),
                    "petsAllowed": "Yes" if random.random() > 0.7 else "No",
                    "view": random.choice(["Ocean", "Mountain", "Lake", "Garden", "City"]),
                    "maxGuests": str(random.randint(4, 12))
                }
            })
    return products

def addVendorProducts(products_list: List[Dict[str, Any]]) -> None:
    for product in products_list:
        response = requests.post("http://localhost:3000/api/products/createProduct", json=product)
        print(f"Added product: {product['name']} - Status: {response.status_code}")

if __name__ == "__main__":
    # Generate all products
    all_products = (
        generate_hotels() +
        generate_apartments()
        # generate_vacation_rentals()
    )

    # Add all products to the database
    addVendorProducts(all_products)
