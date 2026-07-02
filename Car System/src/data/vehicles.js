export const vehicles = [
  {
    id: 1,
    make: 'BMW',
    model: 'BMW 5 Series',
    year: 2022,
    price: '$45,000',
    mileage: '18,000 mi',
    bodyType: 'Sedan',
    color: 'Mineral Grey',
    location: 'Miami Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
      'https://images.unsplash.com/photo-1556448851-9359658cd58a?w=800&q=80'
    ],
    specs: {
      engine: '2.0L TwinPower Turbo I4',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5
    },
    conditionNotes: 'Ex-lease, single owner. Impeccably maintained, zero exterior scratches, minor wear on driver bolster.'
  },
  {
    id: 2,
    make: 'Mercedes-Benz',
    model: 'Mercedes-Benz GLE',
    year: 2023,
    price: '$68,000',
    mileage: '9,500 mi',
    bodyType: 'SUV',
    color: 'Obsidian Black',
    location: 'Los Angeles Depot',
    status: 'reserved',
    thumbnailImage: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'
    ],
    specs: {
      engine: '3.0L Inline-6 Turbo with EQ Boost',
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5
    },
    conditionNotes: 'Showroom condition. Active air suspension, driving assistance package active, zero mechanical alerts.'
  },
  {
    id: 3,
    make: 'Porsche',
    model: 'Porsche 911',
    year: 2021,
    price: '$112,000',
    mileage: '12,000 mi',
    bodyType: 'Sports',
    color: 'Guards Red',
    location: 'New York Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80'
    ],
    specs: {
      engine: '3.0L Twin-Turbo Flat-6',
      transmission: 'Manual',
      fuelType: 'Petrol',
      seats: 4
    },
    conditionNotes: 'Full service history at Porsche authorized centers. Clear protective paint film (PPF) applied to front bumper.'
  },
  {
    id: 4,
    make: 'Audi',
    model: 'Audi Q7',
    year: 2022,
    price: '$58,500',
    mileage: '22,000 mi',
    bodyType: 'SUV',
    color: 'Glacier White',
    location: 'Miami Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'
    ],
    specs: {
      engine: '3.0L Turbocharged V6 MHEV',
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 7
    },
    conditionNotes: 'Excellent family transport, minor scuffing on rear luggage threshold, interior leather professionally detailed.'
  },
  {
    id: 5,
    make: 'Toyota',
    model: 'Toyota Land Cruiser',
    year: 2023,
    price: '$82,000',
    mileage: '5,000 mi',
    bodyType: 'SUV',
    color: 'Silver Metallic',
    location: 'Houston Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80'
    ],
    specs: {
      engine: '3.5L Twin-Turbo V6',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 7
    },
    conditionNotes: 'Barely driven. Import model, fully certified under dealership warranty, underbody factory-sealed against corrosion.'
  },
  {
    id: 6,
    make: 'Tesla',
    model: 'Tesla Model S',
    year: 2023,
    price: '$89,000',
    mileage: '8,200 mi',
    bodyType: 'Sedan',
    color: 'Deep Blue Metallic',
    location: 'Los Angeles Depot',
    status: 'sold',
    thumbnailImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'
    ],
    specs: {
      engine: 'Dual Motor All-Wheel Drive',
      transmission: 'Automatic',
      fuelType: 'Electric',
      seats: 5
    },
    conditionNotes: 'Flawless electric powertrain response. Battery health verified at 98%, minor curb rash on passenger front wheel rim.'
  },
  {
    id: 7,
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2022,
    price: '$94,000',
    mileage: '15,000 mi',
    bodyType: 'SUV',
    color: 'Santorini Black',
    location: 'New York Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
    ],
    specs: {
      engine: '3.0L MHEV Inline-6 Turbo',
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5
    },
    conditionNotes: 'Under warranty, original purchase receipt cached. Dynamic design package pre-installed, panoramic glass roof verified.'
  },
  {
    id: 8,
    make: 'Honda',
    model: 'Honda Civic',
    year: 2023,
    price: '$28,000',
    mileage: '6,700 mi',
    bodyType: 'Sedan',
    color: 'Sonic Grey Pearl',
    location: 'Houston Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80'
    ],
    specs: {
      engine: '1.5L Turbocharged I4',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5
    },
    conditionNotes: 'Commuter car. Fantastic mileage logs, single commuter owner, pristine interior cabin condition.'
  },
  {
    id: 9,
    make: 'Ford',
    model: 'Ford Mustang GT',
    year: 2021,
    price: '$52,000',
    mileage: '20,000 mi',
    bodyType: 'Sports',
    color: 'Race Red',
    location: 'Miami Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80'
    ],
    specs: {
      engine: '5.0L Coyote V8',
      transmission: 'Manual',
      fuelType: 'Petrol',
      seats: 4
    },
    conditionNotes: 'Aftermarket exhaust installed, original included. Tyres changed 2,000 miles ago, alignment report clean.'
  },
  {
    id: 10,
    make: 'Lexus',
    model: 'Lexus RX 350',
    year: 2022,
    price: '$61,000',
    mileage: '13,400 mi',
    bodyType: 'SUV',
    color: 'Eminent White Pearl',
    location: 'Los Angeles Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800&q=80'
    ],
    specs: {
      engine: '3.5L V6 Direct Injection',
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      seats: 5
    },
    conditionNotes: 'Classic luxury crossover. All electronic navigation packages active, lane change alerts functional.'
  },
  {
    id: 11,
    make: 'Chevrolet',
    model: 'Chevrolet Camaro',
    year: 2021,
    price: '$44,000',
    mileage: '17,800 mi',
    bodyType: 'Sports',
    color: 'Shadow Grey Metallic',
    location: 'Houston Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=800&q=80'
    ],
    specs: {
      engine: '6.2L LT1 V8',
      transmission: 'Manual',
      fuelType: 'Petrol',
      seats: 4
    },
    conditionNotes: 'Stored in climate-controlled garage. Brake calipers checked, track records clean, oil changes documented.'
  },
  {
    id: 12,
    make: 'Volkswagen',
    model: 'Volkswagen Tiguan',
    year: 2023,
    price: '$36,500',
    mileage: '4,200 mi',
    bodyType: 'SUV',
    color: 'Platinum Grey',
    location: 'New York Depot',
    status: 'available',
    thumbnailImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80'
    ],
    specs: {
      engine: '2.0L TSI Turbocharged I4',
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5
    },
    conditionNotes: 'Near-new condition. Active digital cockpit, premium upholstery, dealer inspection logs verified.'
  }
];
