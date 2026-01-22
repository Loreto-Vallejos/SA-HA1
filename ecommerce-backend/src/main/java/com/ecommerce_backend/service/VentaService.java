package com.ecommerce_backend.service;

import com.ecommerce_backend.dto.VentaRequestDTO;
import com.ecommerce_backend.dto.VentaResponseDTO;
import java.math.BigDecimal;
import java.util.List;

public interface VentaService {
    VentaResponseDTO procesarVenta(VentaRequestDTO dto);
    VentaResponseDTO obtenerVentaPorId(Long id);
    List<VentaResponseDTO> obtenerTodasLasVentas();
    List<VentaResponseDTO> obtenerVentasPorCliente(Long idCliente);
    List<VentaResponseDTO> obtenerVentasPorEstado(String estado);
    VentaResponseDTO actualizarEstadoVenta(Long idVenta, String nuevoEstado);
    void cancelarVenta(Long idVenta);
    BigDecimal calcularTotalVentasCliente(Long idCliente);
}
