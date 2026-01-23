package com.ecommerce_backend.security.service;

import com.ecommerce_backend.exception.BusinessException;
import com.ecommerce_backend.model.Cliente;
import com.ecommerce_backend.repository.ClienteRepository;
import com.ecommerce_backend.security.dto.AuthRequest;
import com.ecommerce_backend.security.dto.AuthResponse;
import com.ecommerce_backend.security.dto.RegisterRequest;
import com.ecommerce_backend.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que maneja la lógica de negocio de autenticación.
 *
 * Responsabilidades:
 * - Login: validar credenciales y generar token
 * - Registro: crear nuevo cliente y generar token
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Procesa el login de un cliente.
     *
     * Flujo:
     * 1. Autentica credenciales con AuthenticationManager
     * 2. Carga el cliente desde la BD
     * 3. Genera el token JWT
     * 4. Retorna respuesta con datos y token
     */
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        try {
            // 1. Autenticar con Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.contrasena()
                    )
            );
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        // 2. Cargar el cliente para obtener sus datos
        Cliente cliente = clienteRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadCredentialsException("Cliente no encontrado"));

        // 3. Verificar que esté activo
        if (!cliente.isActivo()) {
            throw new BadCredentialsException("La cuenta está desactivada");
        }

        // 4. Generar token JWT
        String token = jwtService.generateToken(cliente.getEmail());

        // 5. Construir y retornar respuesta
        return new AuthResponse(
                cliente.getIdCliente(),
                cliente.getNombre(),
                cliente.getApellido(),
                cliente.getEmail(),
                token
        );
    }

    /**
     * Registra un nuevo cliente.
     *
     * Flujo:
     * 1. Validar que el email no esté registrado
     * 2. Crear el cliente con contraseña hasheada
     * 3. Guardar en la BD
     * 4. Generar token JWT
     * 5. Retornar respuesta con datos y token
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Validar que el email no esté registrado
        if (clienteRepository.existsByEmailIgnoreCase(request.email())) {
            throw new BusinessException("El email ya está registrado");
        }

        // 2. Crear el nuevo cliente
        Cliente nuevoCliente = Cliente.builder()
                .nombre(request.nombre())
                .apellido(request.apellido())
                .email(request.email().toLowerCase())  // Normalizar a minúsculas
                .contrasenaHash(passwordEncoder.encode(request.contrasena()))  // Hashear contraseña
                .telefono(request.telefono())
                .direccion(request.direccion())
                .ciudad(request.ciudad())
                .activo(true)
                .build();

        // 3. Guardar en la BD
        Cliente clienteGuardado = clienteRepository.save(nuevoCliente);

        // 4. Generar token JWT
        String token = jwtService.generateToken(clienteGuardado.getEmail());

        // 5. Construir y retornar respuesta
        return new AuthResponse(
                clienteGuardado.getIdCliente(),
                clienteGuardado.getNombre(),
                clienteGuardado.getApellido(),
                clienteGuardado.getEmail(),
                token
        );
    }
}