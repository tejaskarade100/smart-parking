class User {
  final String id;
  final String name;
  final String email;
  final String userType; // 'user' or 'admin'
  final String? parkingSpotId; // Only for admin users

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.userType,
    this.parkingSpotId,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'userType': userType,
      'parkingSpotId': parkingSpotId,
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      userType: json['userType'] as String,
      parkingSpotId: json['parkingSpotId'] as String?,
    );
  }
}
