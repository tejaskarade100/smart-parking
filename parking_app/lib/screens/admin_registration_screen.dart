import 'package:flutter/material.dart';
import 'package:email_validator/email_validator.dart';

class AdminRegistrationScreen extends StatefulWidget {
  const AdminRegistrationScreen({Key? key}) : super(key: key);

  @override
  State<AdminRegistrationScreen> createState() => _AdminRegistrationScreenState();
}

class _AdminRegistrationScreenState extends State<AdminRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  int _currentStep = 0;
  bool _isLoading = false;

  // Form data
  final Map<String, dynamic> _formData = {
    // Credentials
    'email': '',
    'username': '',
    'password': '',
    'confirmPassword': '',
    
    // Personal Information
    'fullName': '',
    'phone': '',
    'address': '',
    'city': '',
    'state': '',
    'pincode': '',
    
    // Parking Details
    'parkingName': '',
    'parkingType': '',
    'category': '',
    'capacity': '',
    'facilities': <String>[],
    'parkingAddress': '',
    'landmark': '',
    'coordinates': '',
    
    // Security and Access
    'securityMeasures': <String>[],
    'accessHours': '',
    'emergencyContact': '',
    'insuranceDetails': '',
    'accessControl': '',
    
    // Verification Details
    'idType': '',
    'idNumber': '',
    'businessType': '',
    'gstNumber': '',
    'registrationNumber': '',
  };

  List<String> securityMeasures = [
    'CCTV',
    'Security Guards',
    'Access Control System',
    'Emergency Lighting',
    'Emergency Response Team',
  ];

  List<String> facilities = [
    'EV Charging',
    'Car Wash',
    'Valet Parking',
    'Covered Parking',
    'Disabled Access',
  ];

  Widget _buildCredentialsForm() {
    return Column(
      children: [
        const Icon(Icons.security, size: 48, color: Colors.blue),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Email',
            prefixIcon: Icon(Icons.email),
          ),
          keyboardType: TextInputType.emailAddress,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your email';
            }
            if (!EmailValidator.validate(value)) {
              return 'Please enter a valid email';
            }
            return null;
          },
          onSaved: (value) => _formData['email'] = value,
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Username',
            prefixIcon: Icon(Icons.person),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter a username';
            }
            if (value.length < 4) {
              return 'Username must be at least 4 characters';
            }
            return null;
          },
          onSaved: (value) => _formData['username'] = value,
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Password',
            prefixIcon: Icon(Icons.lock),
          ),
          obscureText: true,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter a password';
            }
            if (value.length < 8) {
              return 'Password must be at least 8 characters';
            }
            return null;
          },
          onSaved: (value) => _formData['password'] = value,
        ),
      ],
    );
  }

  Widget _buildPersonalInformationForm() {
    return Column(
      children: [
        const Icon(Icons.person_outline, size: 48, color: Colors.green),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Full Name',
            prefixIcon: Icon(Icons.person),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your full name';
            }
            return null;
          },
          onSaved: (value) => _formData['fullName'] = value,
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Phone Number',
            prefixIcon: Icon(Icons.phone),
          ),
          keyboardType: TextInputType.phone,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your phone number';
            }
            return null;
          },
          onSaved: (value) => _formData['phone'] = value,
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Address',
            prefixIcon: Icon(Icons.location_on),
          ),
          maxLines: 3,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter your address';
            }
            return null;
          },
          onSaved: (value) => _formData['address'] = value,
        ),
      ],
    );
  }

  Widget _buildParkingDetailsForm() {
    return Column(
      children: [
        const Icon(Icons.local_parking, size: 48, color: Colors.orange),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Parking Name',
            prefixIcon: Icon(Icons.business),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter parking name';
            }
            return null;
          },
          onSaved: (value) => _formData['parkingName'] = value,
        ),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          decoration: const InputDecoration(
            labelText: 'Parking Type',
            prefixIcon: Icon(Icons.category),
          ),
          items: ['Commercial', 'Residential', 'Event']
              .map((type) => DropdownMenuItem(
                    value: type.toLowerCase(),
                    child: Text(type),
                  ))
              .toList(),
          onChanged: (value) {
            setState(() {
              _formData['parkingType'] = value;
            });
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please select parking type';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Capacity',
            prefixIcon: Icon(Icons.car_rental),
          ),
          keyboardType: TextInputType.number,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter parking capacity';
            }
            return null;
          },
          onSaved: (value) => _formData['capacity'] = value,
        ),
        const SizedBox(height: 16),
        const Text('Facilities Available', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        Wrap(
          spacing: 8,
          children: facilities.map((facility) {
            return FilterChip(
              label: Text(facility),
              selected: (_formData['facilities'] as List<String>).contains(facility),
              onSelected: (selected) {
                setState(() {
                  if (selected) {
                    (_formData['facilities'] as List<String>).add(facility);
                  } else {
                    (_formData['facilities'] as List<String>).remove(facility);
                  }
                });
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildSecurityAndAccessForm() {
    return Column(
      children: [
        const Icon(Icons.security, size: 48, color: Colors.red),
        const SizedBox(height: 16),
        const Text('Security Measures', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        Wrap(
          spacing: 8,
          children: securityMeasures.map((measure) {
            return FilterChip(
              label: Text(measure),
              selected: (_formData['securityMeasures'] as List<String>).contains(measure),
              onSelected: (selected) {
                setState(() {
                  if (selected) {
                    (_formData['securityMeasures'] as List<String>).add(measure);
                  } else {
                    (_formData['securityMeasures'] as List<String>).remove(measure);
                  }
                });
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          decoration: const InputDecoration(
            labelText: 'Access Hours',
            prefixIcon: Icon(Icons.access_time),
          ),
          items: ['24/7', 'Day Time Only', 'Custom']
              .map((hours) => DropdownMenuItem(
                    value: hours.toLowerCase(),
                    child: Text(hours),
                  ))
              .toList(),
          onChanged: (value) {
            setState(() {
              _formData['accessHours'] = value;
            });
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please select access hours';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'Emergency Contact',
            prefixIcon: Icon(Icons.emergency),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter emergency contact';
            }
            return null;
          },
          onSaved: (value) => _formData['emergencyContact'] = value,
        ),
      ],
    );
  }

  Widget _buildVerificationDetailsForm() {
    return Column(
      children: [
        const Icon(Icons.verified_user, size: 48, color: Colors.purple),
        const SizedBox(height: 16),
        DropdownButtonFormField<String>(
          decoration: const InputDecoration(
            labelText: 'ID Type',
            prefixIcon: Icon(Icons.badge),
          ),
          items: ['Aadhar Card', 'PAN Card', 'Driving License', 'Passport']
              .map((type) => DropdownMenuItem(
                    value: type.toLowerCase().replaceAll(' ', '_'),
                    child: Text(type),
                  ))
              .toList(),
          onChanged: (value) {
            setState(() {
              _formData['idType'] = value;
            });
          },
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please select ID type';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'ID Number',
            prefixIcon: Icon(Icons.numbers),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter ID number';
            }
            return null;
          },
          onSaved: (value) => _formData['idNumber'] = value,
        ),
        const SizedBox(height: 16),
        TextFormField(
          decoration: const InputDecoration(
            labelText: 'GST Number',
            prefixIcon: Icon(Icons.receipt_long),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please enter GST number';
            }
            return null;
          },
          onSaved: (value) => _formData['gstNumber'] = value,
        ),
      ],
    );
  }

  Widget _buildReviewForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.rate_review, size: 48, color: Colors.teal),
        const SizedBox(height: 16),
        const Text(
          'Review Your Information',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        _buildReviewSection('Personal Information', [
          'Full Name: ${_formData['fullName']}',
          'Email: ${_formData['email']}',
          'Phone: ${_formData['phone']}',
        ]),
        _buildReviewSection('Parking Details', [
          'Parking Name: ${_formData['parkingName']}',
          'Type: ${_formData['parkingType']}',
          'Capacity: ${_formData['capacity']}',
        ]),
        _buildReviewSection('Security Measures', [
          'Access Hours: ${_formData['accessHours']}',
          'Security: ${(_formData['securityMeasures'] as List<String>).join(', ')}',
        ]),
        _buildReviewSection('Verification', [
          'ID Type: ${_formData['idType']}',
          'GST Number: ${_formData['gstNumber']}',
        ]),
        const SizedBox(height: 16),
        if (_isLoading)
          const Center(child: CircularProgressIndicator())
        else
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _submitForm,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Submit Registration'),
            ),
          ),
      ],
    );
  }

  Widget _buildReviewSection(String title, List<String> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        ...items.map((item) => Padding(
              padding: const EdgeInsets.only(left: 16, bottom: 4),
              child: Text(item),
            )),
        const SizedBox(height: 16),
      ],
    );
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState?.validate() ?? false) {
      _formKey.currentState?.save();
      setState(() => _isLoading = true);
      
      try {
        // TODO: Implement API call to submit form
        await Future.delayed(const Duration(seconds: 2)); // Simulate API call
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Registration successful!')),
          );
          Navigator.pop(context);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: ${e.toString()}')),
          );
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Registration'),
      ),
      body: Form(
        key: _formKey,
        child: Stepper(
          type: StepperType.vertical,
          currentStep: _currentStep,
          onStepContinue: () {
            if (_currentStep < 5) {
              setState(() => _currentStep++);
            }
          },
          onStepCancel: () {
            if (_currentStep > 0) {
              setState(() => _currentStep--);
            }
          },
          steps: [
            Step(
              title: const Text('Credentials'),
              content: _buildCredentialsForm(),
              isActive: _currentStep >= 0,
            ),
            Step(
              title: const Text('Personal Information'),
              content: _buildPersonalInformationForm(),
              isActive: _currentStep >= 1,
            ),
            Step(
              title: const Text('Parking Details'),
              content: _buildParkingDetailsForm(),
              isActive: _currentStep >= 2,
            ),
            Step(
              title: const Text('Security & Access'),
              content: _buildSecurityAndAccessForm(),
              isActive: _currentStep >= 3,
            ),
            Step(
              title: const Text('Verification'),
              content: _buildVerificationDetailsForm(),
              isActive: _currentStep >= 4,
            ),
            Step(
              title: const Text('Review & Submit'),
              content: _buildReviewForm(),
              isActive: _currentStep >= 5,
            ),
          ],
        ),
      ),
    );
  }
}
