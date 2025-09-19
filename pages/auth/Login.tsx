import React, { useEffect, useState } from "react";
import { loginUser, getStoredUser } from "../../backend/actions/authActions";
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

// Floating Bubble Component
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

const LoginScreen = ({ navigation, onAuthSuccess }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔹 cek user tersimpan di AsyncStorage
  useEffect(() => {
    const checkUser = async () => {
      const user = await getStoredUser();
      if (user) {
        // navigation.navigate("MainTabs"); // langsung masuk kalau ada user
      }
    };
    checkUser();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Email dan password harus diisi!");
      return;
    }
    
    setIsLoading(true);
    try {
      await loginUser(email, password);
      if (onAuthSuccess) onAuthSuccess(); // ⬅️ Trigger cek user di App.tsx
      console.log("Login berhasil!");
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
      <FloatingBubble size={120} left={-30} top={100} duration={6000} opacity={0.05} />
      <FloatingBubble size={80} left={width - 60} top={150} duration={5000} delay={1000} opacity={0.08} />
      <FloatingBubble size={60} left={50} top={height - 200} duration={7000} delay={2000} opacity={0.06} />
      <FloatingBubble size={100} left={width - 80} top={height - 150} duration={4500} delay={3000} opacity={0.07} />
      <FloatingBubble size={40} left={width / 2 - 20} top={80} duration={8000} opacity={0.09} />

      {/* Main Content */}
      <Center flex={1} px="$6">
        <VStack space="xl" w="100%" maxWidth={400}>
          {/* Header */}
          <VStack space="md" alignItems="center" mb="$8">
            <Box style={styles.iconContainer}>
              <Text fontSize={48}>🚀</Text>
            </Box>
            <Text style={styles.welcomeTitle}>Selamat Datang</Text>
            <Text style={styles.welcomeSubtitle}>
                Silakan masuk untuk melanjutkan ke aplikasi inventaris Anda.
            </Text>
          </VStack>

          {/* Form */}
          <VStack space="lg">
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

            {/* Login Button */}
            <Button 
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <ButtonText style={styles.loginButtonText}>
                {isLoading ? "Loading..." : "Masuk"}
              </ButtonText>
            </Button>

            {/* Register Link */}
            <HStack justifyContent="center" mt="$6">
              <Text style={styles.registerText}>Belum punya akun? </Text>
              <Pressable onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Daftar disini</Text>
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
    backgroundColor: 'rgba(99, 102, 241, 0.02)',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#0000F2',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#0000F2',
    borderRadius: 16,
    minHeight: 56,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 24,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  registerText: {
    fontSize: 16,
    color: '#6b7280',
  },
  registerLink: {
    fontSize: 16,
    color: '#0000F2',
    fontWeight: 'bold',
  },
});

export default LoginScreen;