package com.ecommerce_backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VentaRequestDTO {

    @NotNull(message = "El ID del cliente es obligatorio")
    private Long idCliente;

    @NotEmpty(message = "La venta debe tener al menos un producto")
    private List<DetalleVentaRequestDTO> detalles;
}