"""
Management command to seed the database with realistic demo data.
Usage: python manage.py seed_data
"""

import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from trips.models import Trip, ItineraryDay, ItineraryItem
from budget.models import BudgetCategory, BudgetItem
from checklist.models import PackingItem


TRIPS_DATA = [
    {
        'title': 'Bali Paradise Getaway',
        'destination': 'Bali, Indonesia',
        'start_date': date(2025, 3, 10),
        'end_date': date(2025, 3, 17),
        'description': 'Exploring temples, rice terraces, and pristine beaches in Bali.',
        'trip_type': 'relaxation',
        'budget': 1800,
        'cover_image': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600',
        'status': 'completed',
        'rating': 5,
    },
    {
        'title': 'Swiss Alps Adventure',
        'destination': 'Swiss Alps, Switzerland',
        'start_date': date(2025, 6, 1),
        'end_date': date(2025, 6, 8),
        'description': 'Hiking, skiing, and exploring charming alpine villages.',
        'trip_type': 'adventure',
        'budget': 3500,
        'cover_image': 'https://images.unsplash.com/photo-1531366936337-77b128052684?auto=format&fit=crop&q=80&w=600',
        'status': 'completed',
        'rating': 5,
    },
    {
        'title': 'Kyoto Cultural Journey',
        'destination': 'Kyoto, Japan',
        'start_date': date(2025, 4, 5),
        'end_date': date(2025, 4, 14),
        'description': 'Immersing in ancient temples, tea ceremonies, and cherry blossoms.',
        'trip_type': 'cultural',
        'budget': 2800,
        'cover_image': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600',
        'status': 'completed',
        'rating': 4,
    },
    {
        'title': 'Santorini Honeymoon',
        'destination': 'Santorini, Greece',
        'start_date': date(2025, 7, 20),
        'end_date': date(2025, 7, 27),
        'description': 'Romantic sunsets, cliffside dining, and Aegean sea views.',
        'trip_type': 'romantic',
        'budget': 4200,
        'cover_image': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac542?auto=format&fit=crop&q=80&w=600',
        'status': 'upcoming',
    },
    {
        'title': 'New York City Break',
        'destination': 'New York, USA',
        'start_date': date(2025, 9, 15),
        'end_date': date(2025, 9, 20),
        'description': 'Broadway shows, Central Park, and Manhattan skyline.',
        'trip_type': 'cultural',
        'budget': 3000,
        'cover_image': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600',
        'status': 'upcoming',
    },
    {
        'title': 'Maldives Luxury Escape',
        'destination': 'Maldives',
        'start_date': date(2025, 12, 1),
        'end_date': date(2025, 12, 7),
        'description': 'Overwater bungalows, snorkeling, and total relaxation.',
        'trip_type': 'relaxation',
        'budget': 5500,
        'cover_image': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=600',
        'status': 'upcoming',
    },
]

BUDGET_CATEGORIES = [
    ('accommodation', 0.35, '#6366f1'),
    ('transportation', 0.20, '#14b8a6'),
    ('food', 0.20, '#f59e0b'),
    ('activities', 0.12, '#ef4444'),
    ('shopping', 0.08, '#8b5cf6'),
    ('miscellaneous', 0.05, '#64748b'),
]

EXPENSE_ITEMS = {
    'accommodation': ['Hotel Night', 'Airbnb', 'Resort Suite', 'Hostel Bed', 'Villa Rental'],
    'transportation': ['Airport Transfer', 'Train Ticket', 'Taxi Ride', 'Rental Car', 'Ferry Ticket', 'Bus Pass'],
    'food': ['Restaurant Dinner', 'Street Food', 'Cafe Breakfast', 'Fine Dining', 'Grocery Run', 'Food Tour'],
    'activities': ['Museum Entry', 'Guided Tour', 'Snorkeling Trip', 'Cooking Class', 'Temple Visit', 'Hiking Guide'],
    'shopping': ['Souvenirs', 'Local Crafts', 'Market Shopping', 'Gift Shop'],
    'miscellaneous': ['Tips', 'SIM Card', 'Laundry', 'Travel Insurance'],
}

PACKING_ITEMS = {
    'clothing': ['T-shirts', 'Jeans', 'Shorts', 'Swimsuit', 'Jacket', 'Socks', 'Underwear', 'Dress shoes', 'Sneakers', 'Sandals', 'Hat', 'Sunglasses'],
    'toiletries': ['Toothbrush', 'Toothpaste', 'Shampoo', 'Sunscreen', 'Deodorant', 'Razor', 'Moisturizer', 'Lip balm'],
    'electronics': ['Phone charger', 'Power bank', 'Camera', 'Headphones', 'Travel adapter', 'Laptop', 'USB cable'],
    'documents': ['Passport', 'Flight tickets', 'Hotel booking', 'Travel insurance', 'Visa copy', 'ID card', 'Emergency contacts'],
    'essentials': ['Water bottle', 'First aid kit', 'Medications', 'Snacks', 'Travel pillow', 'Eye mask', 'Earplugs'],
    'miscellaneous': ['Umbrella', 'Daypack', 'Laundry bag', 'Zip-lock bags', 'Notebook', 'Pen'],
}


class Command(BaseCommand):
    help = 'Seeds the database with realistic demo data for the Traveloop hackathon.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Clear existing data
        PackingItem.objects.all().delete()
        BudgetItem.objects.all().delete()
        BudgetCategory.objects.all().delete()
        ItineraryItem.objects.all().delete()
        ItineraryDay.objects.all().delete()
        Trip.objects.all().delete()

        trips = []
        for data in TRIPS_DATA:
            trip = Trip.objects.create(**data)
            trips.append(trip)
            self.stdout.write(f'  [OK] Trip: {trip.title}')

            # Create itinerary days
            for day_num in range(1, trip.duration_days + 1):
                day = ItineraryDay.objects.create(
                    trip=trip,
                    day=day_num,
                    title=f'Day {day_num} — Explore {trip.destination.split(",")[0]}',
                )
                # Add 2-4 items per day
                for order, _ in enumerate(range(random.randint(2, 4))):
                    ItineraryItem.objects.create(
                        itinerary_day=day,
                        time=f'{8 + order * 3}:00',
                        title=random.choice(EXPENSE_ITEMS.get('activities', ['Sightseeing'])),
                        description=f'Activity on day {day_num}',
                        location=trip.destination,
                        cost=random.randint(10, 80),
                        order=order,
                    )

            # Create budget categories and items
            for cat_key, ratio, color in BUDGET_CATEGORIES:
                planned = round(float(trip.budget) * ratio, 2)
                cat_obj = BudgetCategory.objects.create(
                    trip=trip,
                    category=cat_key,
                    planned=planned,
                    color=color,
                )

                # Add 2-5 expense items per category for completed trips
                if trip.status == 'completed':
                    expense_names = EXPENSE_ITEMS.get(cat_key, ['Expense'])
                    num_items = random.randint(2, 5)
                    for j in range(num_items):
                        amount = round(planned / num_items * random.uniform(0.7, 1.3), 2)
                        BudgetItem.objects.create(
                            category=cat_obj,
                            title=random.choice(expense_names),
                            amount=amount,
                            date=trip.start_date + timedelta(days=random.randint(0, trip.duration_days - 1)),
                            notes=f'Expense during {trip.title}',
                        )

            # Create packing items
            for cat_key, items in PACKING_ITEMS.items():
                selected = random.sample(items, min(len(items), random.randint(3, 6)))
                for item_name in selected:
                    PackingItem.objects.create(
                        trip=trip,
                        name=item_name,
                        category=cat_key,
                        is_packed=random.choice([True, False]) if trip.status == 'completed' else False,
                        quantity=random.randint(1, 3) if cat_key == 'clothing' else 1,
                    )

        self.stdout.write(self.style.SUCCESS(
            f'\n  Seeded {len(trips)} trips with itineraries, budgets, and packing lists!'
        ))
