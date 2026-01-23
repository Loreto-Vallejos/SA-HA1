package com.ecommerce_backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoRequestDTO {

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(min = 3, max = 150, message = "El nombre debe tener entre 3 y 150 caracteres")
    private String nombre;

    @Size(max = 50, message = "La categoría no puede exceder 50 caracteres")
    private String categoria;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal precio;

    @DecimalMin(value = "0.00", message = "El precio anterior no puede ser negativo")
    private BigDecimal precioAnterior;

    @Size(max = 10, message = "El descuento no puede exceder 10 caracteres")
    private String descuento;

    @Size(max = 20, message = "El badge color no puede exceder 20 caracteres")
    private String badgeColor;

    private String imagen;

    private Map<String, Object> detalles;

    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
}