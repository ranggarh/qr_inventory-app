import React, { useState } from "react";
import { registerUser } from "../../backend/actions/authActions";
import {
  VStack,
  Input,
  InputField,
  Button,
  ButtonText,
  Text,
  Box,
  HStack,
  Center,
  Pressable,
} from "@gluestack-ui/themed";
import { Animated, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

// Floating Bubble Component (sama seperti LoginScreen)
const FloatingBubble = ({ 
  size, 
  left, 
  top, 
  duration = 4000, 
  delay = 0,
  opacity = 0.1 
}: {
  size: number;
  left: number;
  top: number;
  duration?: number;
  delay?: number;
  opacity?: number;
}) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animate();
  }, []);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          left: left,
          top: top,
          opacity: opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    />
  );
};

const RegisterScreen = ({ navigation }: any) => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!nama.trim() || !email.trim() || !password.trim()) {
      alert("Semua field harus diisi!");
      return;
    }

    if (password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(email, password, nama); // kirim nama juga
      // alert("Registrasi berhasil & tersimpan di database!");
      // navigation.navigate("MainTabs");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box flex={1} style={styles.container}>
      {/* Background Gradient Effect */}
      <Box style={styles.gradientOverlay} />
      
      {/* Floating Bubbles */}
      <FloatingBubble size={100} left={-20} top={120} duration={5500} opacity={0.06} />
      <FloatingBubble size={70} left={width - 50} top={180} duration={6000} delay={1500} opacity={0.08} />
      <FloatingBubble size={90} left={30} top={height - 180} duration={4800} delay={2500} opacity={0.05} />
      <FloatingBubble size={110} left={width - 90} top={height - 120} duration={7000} delay={3500} opacity={0.07} />
      <FloatingBubble size={50} left={width / 2 - 25} top={60} duration={6500} opacity={0.09} />

      {/* Main Content */}
      <Center flex={1} px="$6">
        <VStack space="xl" w="100%" maxWidth={400}>
          {/* Header */}
          <VStack space="md" alignItems="center" mb="$6">
            <Box style={styles.iconContainer}>
              <Text fontSize={48}>✨</Text>
            </Box>
            <Text style={styles.welcomeTitle}>Buat Akun</Text>
            <Text style={styles.welcomeSubtitle}>
              Bergabunglah dengan kami dengan membuat akun baru untuk mengelola inventaris Anda.
            </Text>
          </VStack>

          {/* Form */}
          <VStack space="lg">
            <Box style={styles.inputContainer}>
              <Input style={styles.input}>
                <InputField
                  placeholder="Masukkan nama Anda"
                  value={nama}
                  onChangeText={setNama}
                  style={styles.inputField}
                />
              </Input>
            </Box>

            <Box style={styles.inputContainer}>
              <Input style={styles.input}>
                <InputField
                  placeholder="Masukkan email Anda"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.inputField}
                />
              </Input>
            </Box>

            <Box style={styles.inputContainer}>
              <Input style={styles.input}>
                <InputField
                  placeholder="Masukkan kata sandi Anda"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.inputField}
                />
              </Input>
            </Box>

            {/* Register Button */}
            <Button 
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <ButtonText style={styles.registerButtonText}>
                {isLoading ? "Loading..." : "Daftar"}
              </ButtonText>
            </Button>

            {/* Login Link */}
            <HStack justifyContent="center" mt="$6">
              <Text style={styles.loginText}>Sudah punya akun? </Text>
              <Pressable onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Masuk</Text>
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
      </Center>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2, 4, 108, 0.02)',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#0000F2',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    borderWidth: 2,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    backgroundColor: '#ffffff',
    minHeight: 56,
  },
  inputField: {
    fontSize: 16,
    color: '#1f2937',
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#6366f1',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#0000F2',
    borderRadius: 16,
    minHeight: 56,
    shadowColor: '#0000F2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 24,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  orText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  socialButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  loginText: {
    fontSize: 16,
    color: '#6b7280',
  },
  loginLink: {
    fontSize: 16,
    color: '#0000F2',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;