import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'booking_screen.dart';

class UserDashboard extends StatefulWidget {
  const UserDashboard({super.key});

  @override
  State<UserDashboard> createState() => _UserDashboardState();
}

class _UserDashboardState extends State<UserDashboard> {
  final List<Map<String, dynamic>> parkingSpots = [
    {
      'name': 'Central Parking',
      'address': '123 Main St, City',
      'price': '₹50/hr',
      'available': 5,
    },
    {
      'name': 'Mall Parking',
      'address': '456 Park Ave, City',
      'price': '₹40/hr',
      'available': 12,
    },
    {
      'name': 'Street Parking',
      'address': '789 Road, City',
      'price': '₹30/hr',
      'available': 3,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Map View
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.4,
            child: const GoogleMap(
              initialCameraPosition: CameraPosition(
                target: LatLng(19.0760, 72.8777), // Mumbai coordinates
                zoom: 14,
              ),
            ),
          ),
          
          // Search Bar and Filter
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search parking spots',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),

          // Parking Spots List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: parkingSpots.length,
              itemBuilder: (context, index) {
                final spot = parkingSpots[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    title: Text(
                      spot['name'],
                      style: GoogleFonts.poppins(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          spot['address'],
                          style: GoogleFonts.poppins(),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Text(
                              spot['price'],
                              style: GoogleFonts.poppins(
                                color: const Color(0xFF007AFF),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            const Spacer(),
                            Text(
                              '${spot['available']} spots available',
                              style: GoogleFonts.poppins(
                                color: Colors.green,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    trailing: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => BookingScreen(spot: spot),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF007AFF),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      child: Text(
                        'Book',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
