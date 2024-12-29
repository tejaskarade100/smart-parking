class ParkingSpot {
  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final double pricePerHour;
  final int totalSpots;
  final int availableSpots;
  final String ownerId;

  ParkingSpot({
    required this.id,
    required this.name,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.pricePerHour,
    required this.totalSpots,
    required this.availableSpots,
    required this.ownerId,
  });

  factory ParkingSpot.fromJson(Map<String, dynamic> json) {
    return ParkingSpot(
      id: json['id'],
      name: json['name'],
      address: json['address'],
      latitude: json['latitude'],
      longitude: json['longitude'],
      pricePerHour: json['pricePerHour'].toDouble(),
      totalSpots: json['totalSpots'],
      availableSpots: json['availableSpots'],
      ownerId: json['ownerId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'pricePerHour': pricePerHour,
      'totalSpots': totalSpots,
      'availableSpots': availableSpots,
      'ownerId': ownerId,
    };
  }
}
