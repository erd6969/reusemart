import 'package:flutter/material.dart';
import 'package:reusemart_mobile/AuthPage/login.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // === Yellow Section ===
            Container(
              width: double.infinity,
              color: const Color.fromARGB(255, 241, 194, 24),
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  const SizedBox(height: 36),
                  CircleAvatar(
                    radius: 70,
                    backgroundColor: Colors.white,
                    child: Image.asset(
                      'images/logo-reusemart.png',
                      width: 100,
                      height: 100,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'ReuseMart',
                    style: TextStyle(
                      fontSize: 48,
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 28),
                  const Text(
                    'Reuse mart is a company that makes it easy for people to buy used stuff or sell them!',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color.fromARGB(255, 23, 79, 1),
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            // === Green Section (Vision & Mission) ===
            Container(
              width: double.infinity,
              color: const Color.fromARGB(255, 23, 79, 1),
              padding: const EdgeInsets.symmetric(vertical: 32.0),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Vision Box
                      boxVisiMisi(
                        icon: Icons.visibility,
                        title: 'Vision',
                        text:
                            'Reuse mart is a company that makes it easy for people to buy used stuff or sell them!',
                      ),
                      // Mission Box
                      boxVisiMisi(
                        icon: Icons.flag,
                        title: 'Mission',
                        text:
                            'Reuse mart is a company that makes it easy for people to buy used stuff or sell them!',
                      ),
                    ],
                  ),

                  const SizedBox(height: 32),

                  // === Slider Section ===
                  SizedBox(
                    height: 180,
                    child: PageView(
                      controller: PageController(viewportFraction: 0.7),
                      children: [
                        sliderCard(
                          'images/kasiduit.png',
                        ),
                        sliderCard(
                          'images/ambilbarang.png',
                        ),
                        sliderCard(
                          'images/onkle.png',
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // === Founder Section ===
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    child: Row(
                      children: [
                        // Founder Image
                        ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.asset(
                            'images/chen-quotes.jpeg',
                            width: 160,
                            height: 200,
                            fit: BoxFit.cover,
                          ),
                        ),
                        const SizedBox(width: 16),
                        // Founder Info
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.yellow,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Meet Our Founder',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 0, 0, 0),
                                  ),
                                ),
                                Text(
                                  'Mr. Raka Pratama',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  'Jadi ini adalah bapak penemu reusemart, beliau adalah seorang mahasiswa yang sangat peduli dengan lingkungan. Beliau ingin orang-orang bisa membeli barang bekas dengan mudah dan aman.',
                                  style: TextStyle(fontSize: 16),
                                  textAlign: TextAlign.justify,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // === Login Button ===
                  // ElevatedButton(
                  //   style: ElevatedButton.styleFrom(
                  //     backgroundColor: Colors.yellow,
                  //     padding:
                  //         const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
                  //     shape: RoundedRectangleBorder(
                  //       borderRadius: BorderRadius.circular(30),
                  //     ),
                  //   ),
                  //   onPressed: () {
                  //     Navigator.push(
                  //       context,
                  //       MaterialPageRoute(builder: (context) => const LoginPage()),
                  //     );
                  //   },
                  //   child: const Row(
                  //     mainAxisSize: MainAxisSize.min,
                  //     children: [
                  //       Text(
                  //         'Login Now',
                  //         style: TextStyle(
                  //           color: Colors.black,
                  //           fontWeight: FontWeight.bold,
                  //         ),
                  //       ),
                  //       SizedBox(width: 8),
                  //       Icon(Icons.arrow_forward, color: Colors.black),
                  //     ],
                  //   ),
                  // ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // === Helper Widget: Info Box ===
  Widget boxVisiMisi(
      {required IconData icon, required String title, required String text}) {
    return Container(
      width: 150,
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.yellow,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(
            color: Colors.black45,
            blurRadius: 6,
            offset: Offset(2, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, size: 32, color: Colors.black),
          const SizedBox(height: 8),
          Text(title,
              style:
                  const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(text, textAlign: TextAlign.center),
        ],
      ),
    );
  }

  // === Helper Widget: Slider Card ===
  Widget sliderCard(String imagePath) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Stack(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.asset(
              imagePath,
              fit: BoxFit.cover,
              width: double.infinity,
            ),
          ),
        ],
      ),
    );
  }
}
