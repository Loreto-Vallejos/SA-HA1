package com.ecommerce_backend.security.config;

import com.ecommerce_backend.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    /**
     * Configura la cadena de filtros de seguridad HTTP
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Desactivar CSRF (no necesario para APIs REST stateless)
                .csrf(csrf -> csrf.disable())

                // Habilitar CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Configurar sesiones como STATELESS (no guardamos sesión, usamos JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Configurar autorización de rutas
                .authorizeHttpRequests(auth -> auth
                        // ═══════════════════════════════════════════
                        // RUTAS PÚBLICAS (sin autenticación)
                        // ═══════════════════════════════════════════

                        // Autenticación
                        .requestMatchers("/auth/**").permitAll()

                        // Productos - GET público (ver catálogo)
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()

                        // Documentación Swagger (si la agregas después)
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Health check
                        .requestMatchers("/actuator/health").permitAll()

                        // ═══════════════════════════════════════════
                        // RUTAS PROTEGIDAS (requieren JWT válido)
                        // ═══════════════════════════════════════════

                        // Todo lo demás requiere autenticación
                        .anyRequest().authenticated()
                )

                // Agregar el filtro JWT antes del filtro estándar de autenticación
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configuración de CORS para permitir peticiones del frontend
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Orígenes permitidos (ajusta según tu frontend)
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.vercel.app"
        ));

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Headers permitidos
        configuration.setAllowedHeaders(List.of("*"));

        // Permitir envío de credenciales (cookies, auth headers)
        configuration.setAllowCredentials(true);

        // Exponer el header Authorization en la respuesta
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Encoder para hashear contraseñas con BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Gestor de autenticación de Spring Security
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}