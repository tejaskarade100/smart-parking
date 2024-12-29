import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class MapScreen extends StatefulWidget {
  final String cityName;
  final double latitude;
  final double longitude;

  const MapScreen({
    Key? key,
    required this.cityName,
    required this.latitude,
    required this.longitude,
  }) : super(key: key);

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final Set<Marker> _markers = {};
  bool _isLoading = true;
  ParkingSpotInfo? _selectedSpot;
  List<ParkingSpotInfo> _parkingSpots = [];

  @override
  void initState() {
    super.initState();
    _generateRandomParkingSpots();
  }

  void _generateRandomParkingSpots() {
    final random = Random();
    for (int i = 0; i < 5; i++) {
      // Generate random offsets within roughly 2km
      final latOffset = (random.nextDouble() - 0.5) * 0.02;
      final lngOffset = (random.nextDouble() - 0.5) * 0.02;
      
      final spot = ParkingSpotInfo(
        id: 'spot_$i',
        name: 'Parking Spot ${i + 1}',
        address: '${widget.cityName} Area ${i + 1}',
        totalSpots: random.nextInt(50) + 10,
        availableSpots: random.nextInt(20) + 5,
        pricePerHour: (random.nextInt(100) + 30).toDouble(),
        rating: (random.nextInt(20) + 30) / 10,
        latitude: widget.latitude + latOffset,
        longitude: widget.longitude + lngOffset,
      );

      _parkingSpots.add(spot);
      _markers.add(
        Marker(
          point: LatLng(spot.latitude, spot.longitude),
          width: 40,
          height: 40,
          child: GestureDetector(
            onTap: () => _showParkingSpotInfo(spot),
            child: Container(
              decoration: BoxDecoration(
                color: spot.availableSpots > 0 ? Colors.blue : Colors.grey,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: const Icon(
                Icons.local_parking,
                color: Colors.white,
                size: 24,
              ),
            ),
          ),
        ),
      );
    }
    setState(() => _isLoading = false);
  }

  void _showParkingSpotInfo(ParkingSpotInfo spot) {
    setState(() => _selectedSpot = spot);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.4,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          spot.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          spot.address,
                          style: const TextStyle(color: Colors.white70),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 16),
                        const SizedBox(width: 4),
                        Text(
                          spot.rating.toString(),
                          style: TextStyle(
                            color: Theme.of(context).primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildInfoRow(
                      Icons.local_parking,
                      'Available Spots',
                      '${spot.availableSpots}/${spot.totalSpots}',
                    ),
                    const SizedBox(height: 12),
                    _buildInfoRow(
                      Icons.attach_money,
                      'Price per Hour',
                      '₹${spot.pricePerHour.toStringAsFixed(2)}',
                    ),
                    const Spacer(),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Booking functionality coming soon!'),
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: const Text(
                          'Book Now',
                          style: TextStyle(fontSize: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: Colors.grey),
        const SizedBox(width: 8),
        Text(
          label,
          style: const TextStyle(color: Colors.grey),
        ),
        const Spacer(),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Available Parking Spots'),
            Text(
              widget.cityName,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : FlutterMap(
              options: MapOptions(
                initialCenter: LatLng(widget.latitude, widget.longitude),
                initialZoom: 14,
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  subdomains: const ['a', 'b', 'c'],
                ),
                MarkerLayer(markers: _markers.toList()),
              ],
            ),
    );
  }
}

class ParkingSpotInfo {
  final String id;
  final String name;
  final String address;
  final int totalSpots;
  final int availableSpots;
  final double pricePerHour;
  final double rating;
  final double latitude;
  final double longitude;

  ParkingSpotInfo({
    required this.id,
    required this.name,
    required this.address,
    required this.totalSpots,
    required this.availableSpots,
    required this.pricePerHour,
    required this.rating,
    required this.latitude,
    required this.longitude,
  });
}
