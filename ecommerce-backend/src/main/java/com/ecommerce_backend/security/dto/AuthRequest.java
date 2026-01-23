package com.ecommerce_backend.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para la solicitud de login.
 *
 * Contiene las credenciales del usuario:
 * - email: identificador único del usuario
 * - contrasena: contraseña en texto plano (se validará contra el hash)
 *
 * Uso de Record: clase inmutable y compacta para DTOs simples.
 */
public record AuthRequest(

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El formato del email no es válido")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        String contrasena

) {}