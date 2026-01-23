package com.ecommerce_backend.security.controller;

import com.ecommerce_backend.dto.ApiResponseDTO;
import com.ecommerce_backend.security.dto.AuthRequest;
import com.ecommerce_backend.security.dto.AuthResponse;
import com.ecommerce_backend.security.dto.RegisterRequest;
import com.ecommerce_backend.security.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para endpoints de autenticación.
 *
 * Endpoints públicos (no requieren token):
 * - POST /auth/login    - Iniciar sesión
 * - POST /auth/register - Registrar nuevo cliente
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Endpoint de login.
     *
     * POST /auth/login
     * {
     *   "email": "cliente@email.com",
     *   "contrasena": "miPassword123"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<AuthResponse>> login(
            @Valid @RequestBody AuthRequest request) {

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponseDTO.success("Login exitoso", response)
        );
    }

    /**
     * Endpoint de registro.
     *
     * POST /auth/register
     * {
     *   "nombre": "Juan",
     *   "apellido": "Pérez",
     *   "email": "nuevo@email.com",
     *   "contrasena": "miPassword123",
     *   "telefono": "+56 9 1234 5678",
     *   "direccion": "Av. Principal 123",
     *   "ciudad": "Santiago"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        AuthResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponseDTO.success("Registro exitoso", response));
    }

    /**
     * Endpoint para verificar si el token es válido.
     * Este endpoint SÍ requiere autenticación.
     */
    @GetMapping("/verify")
    public ResponseEntity<ApiResponseDTO<String>> verifyToken() {
        return ResponseEntity.ok(
                ApiResponseDTO.success("Autenticación verificada", "Token válido")
        );
    }
}