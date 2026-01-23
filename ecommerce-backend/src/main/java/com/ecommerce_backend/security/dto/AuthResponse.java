package com.ecommerce_backend.security.dto;

/**
 * DTO para la respuesta de autenticación (login/registro).
 *
 * Contiene:
 * - Datos básicos del usuario autenticado
 * - Token JWT para usar en peticiones posteriores
 *
 * El frontend debe guardar el token y enviarlo en el header
 * Authorization: Bearer {token}
 */
public record AuthResponse(

        Long idCliente,
        String nombre,
        String apellido,
        String email,
        String token

) {
    /**
     * Factory method para crear respuesta desde los datos del cliente
     */
    public static AuthResponse of(Long id, String nombre, String apellido, String email, String token) {
        return new AuthResponse(id, nombre, apellido, email, token);
    }
}