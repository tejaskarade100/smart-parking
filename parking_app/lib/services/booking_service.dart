import 'package:uuid/uuid.dart';
import '../models/booking.dart';
import '../models/parking_spot.dart';
import '../data/dummy_data.dart';

class BookingService {
  static final BookingService _instance = BookingService._internal();
  factory BookingService() => _instance;
  BookingService._internal();

  final List<ParkingSpot> _parkingSpots = DummyData.parkingSpots;
  final List<Booking> _bookings = [];
  final _uuid = const Uuid();

  List<ParkingSpot> getAllParkingSpots() {
    return List.from(_parkingSpots);
  }

  ParkingSpot? getParkingSpotById(String id) {
    try {
      return _parkingSpots.firstWhere((spot) => spot.id == id);
    } catch (e) {
      return null;
    }
  }

  List<ParkingSpot> searchParkingSpots(String query) {
    query = query.toLowerCase();
    return _parkingSpots.where((spot) {
      return spot.name.toLowerCase().contains(query) ||
          spot.address.toLowerCase().contains(query);
    }).toList();
  }

  Future<Booking> createBooking({
    required String userId,
    required String parkingSpotId,
    required DateTime startTime,
    required DateTime endTime,
  }) async {
    final spot = getParkingSpotById(parkingSpotId);
    if (spot == null) throw Exception('Parking spot not found');
    if (spot.availableSpots <= 0) throw Exception('No spots available');

    final hours = endTime.difference(startTime).inHours;
    final totalPrice = hours * spot.pricePerHour;

    final booking = Booking(
      id: _uuid.v4(),
      userId: userId,
      parkingSpotId: parkingSpotId,
      startTime: startTime,
      endTime: endTime,
      totalPrice: totalPrice,
      status: 'confirmed',
    );

    _bookings.add(booking);
    
    // Update available spots
    final spotIndex = _parkingSpots.indexWhere((s) => s.id == parkingSpotId);
    _parkingSpots[spotIndex] = ParkingSpot(
      id: spot.id,
      name: spot.name,
      address: spot.address,
      latitude: spot.latitude,
      longitude: spot.longitude,
      pricePerHour: spot.pricePerHour,
      totalSpots: spot.totalSpots,
      availableSpots: spot.availableSpots - 1,
      ownerId: spot.ownerId,
    );

    return booking;
  }

  List<Booking> getUserBookings(String userId) {
    return _bookings.where((booking) => booking.userId == userId).toList();
  }

  List<Booking> getParkingSpotBookings(String parkingSpotId) {
    return _bookings
        .where((booking) => booking.parkingSpotId == parkingSpotId)
        .toList();
  }
}
