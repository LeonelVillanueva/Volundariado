import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/panel_screen.dart';
import 'screens/registro_voluntario_screen.dart';
import 'screens/registro_docente_screen.dart';

void main() async {
  // Cargar variables de entorno
  await dotenv.load(fileName: ".env");
  
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: 'Voluntariado',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
          useMaterial3: true,
        ),
        home: const SplashScreen(),
        routes: {
          '/registro-voluntario': (context) => const RegistroVoluntarioScreen(),
          '/registro-docente': (context) => const RegistroDocenteScreen(),
        },
      ),
    );
  }
}

/// Pantalla de splash que verifica la sesión
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkSession();
  }

  Future<void> _checkSession() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.verificarSesion();

    // Esperar un momento para mostrar el splash
    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      // Navegar según el estado de autenticación
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => authProvider.isAuthenticated
              ? const PanelScreen()
              : const LoginScreen(),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Colors.blue.shade50,
              Colors.indigo.shade100,
            ],
          ),
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.volunteer_activism,
                size: 100,
                color: Colors.indigo,
              ),
              SizedBox(height: 24),
              Text(
                'Voluntariado',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.indigo,
                ),
              ),
              SizedBox(height: 16),
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.indigo),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

