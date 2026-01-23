package com.ecommerce_backend.dto;

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
public class ProductoResponseDTO {

    private Long idProducto;
    private String nombre;
    private String categoria;
    private String descripcion;
    private BigDecimal precio;
    private BigDecimal precioAnterior;
    private String descuento;
    private String badgeColor;
    private String imagen;
    private Map<String, Object> detalles;
    private Integer stock;

    // Campos calculados
    private String estadoStock;
    private Boolean disponible;
}