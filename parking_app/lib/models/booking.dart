class Booking {
  final String id;
  final String userId;
  final String parkingSpotId;
  final DateTime startTime;
  final DateTime endTime;
  final double totalPrice;
  final String status; // 'pending', 'confirmed', 'completed', 'cancelled'

  Booking({
    required this.id,
    required this.userId,
    required this.parkingSpotId,
    required this.startTime,
    required this.endTime,
    required this.totalPrice,
    required this.status,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'],
      userId: json['userId'],
      parkingSpotId: json['parkingSpotId'],
      startTime: DateTime.parse(json['startTime']),
      endTime: DateTime.parse(json['endTime']),
      totalPrice: json['totalPrice'].toDouble(),
      status: json['status'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'parkingSpotId': parkingSpotId,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime.toIso8601String(),
      'totalPrice': totalPrice,
      'status': status,
    };
  }
}
