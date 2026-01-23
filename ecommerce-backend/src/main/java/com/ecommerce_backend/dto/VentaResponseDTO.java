package com.ecommerce_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaResponseDTO {
    private Long idVenta;
    private ClienteResponseDTO cliente;
    private LocalDateTime fechaVenta;
    private BigDecimal total;
    private String estado;
    private List<DetalleVentaResponseDTO> detalles;
}