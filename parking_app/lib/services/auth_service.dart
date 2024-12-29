import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  User? _currentUser;
  User? get currentUser => _currentUser;

  // Key for storing user data in SharedPreferences
  static const String _userKey = 'user_data';

  Future<String> login(String email, String password) async {
    // Simple validation
    if (email.isEmpty || password.isEmpty) throw 'Email and password are required';

    try {
      // For demo purposes, hardcoded users
      if (email == 'user@test.com' && password == 'password123') {
        final user = User(
          id: 'user1',
          name: 'Test User',
          email: email,
          userType: 'user',
        );
        await _saveUser(user);
        return 'user';
      } else if (email == 'admin1@test.com' && password == 'password123') {
        final user = User(
          id: 'admin1',
          name: 'Admin One',
          email: email,
          userType: 'admin',
        );
        await _saveUser(user);
        return 'admin';
      } else if (email == 'admin2@test.com' && password == 'password123') {
        final user = User(
          id: 'admin2',
          name: 'Admin Two',
          email: email,
          userType: 'admin',
        );
        await _saveUser(user);
        return 'admin';
      } else if (email == 'admin3@test.com' && password == 'password123') {
        final user = User(
          id: 'admin3',
          name: 'Admin Three',
          email: email,
          userType: 'admin',
        );
        await _saveUser(user);
        return 'admin';
      }
      
      throw 'Invalid email or password';
    } catch (e) {
      throw e.toString();
    }
  }

  Future<bool> register({
    required String name,
    required String email,
    required String password,
    required String userType,
    String? parkingSpotId,
  }) async {
    try {
      final user = User(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: name,
        email: email,
        userType: userType,
        parkingSpotId: parkingSpotId,
      );
      await _saveUser(user);
      return true;
    } catch (e) {
      print('Registration error: $e');
      return false;
    }
  }

  Future<void> _saveUser(User user) async {
    _currentUser = user;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(user.toJson()));
  }

  Future<bool> loadUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userData = prefs.getString(_userKey);
      if (userData != null) {
        _currentUser = User.fromJson(jsonDecode(userData));
        return true;
      }
      return false;
    } catch (e) {
      print('Load user error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    _currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
  }

  registerUser(String text, String text2, String text3) {}
}
