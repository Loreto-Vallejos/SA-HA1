package com.ecommerce_backend.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para la solicitud de registro de nuevo cliente.
 *
 * Contiene todos los datos necesarios para crear una cuenta:
 * - Datos obligatorios: nombre, apellido, email, contrasena
 * - Datos opcionales: telefono, direccion, ciudad
 */
public record RegisterRequest(

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
        String nombre,

        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
        String apellido,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El formato del email no es válido")
        @Size(max = 150, message = "El email no puede exceder 150 caracteres")
        String email,

        @NotBlank(message = "La contraseña es obligatoria")
        @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
        String contrasena,

        // Campos opcionales
        @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
        String telefono,

        @Size(max = 255, message = "La dirección no puede exceder 255 caracteres")
        String direccion,

        @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
        String ciudad

) {}