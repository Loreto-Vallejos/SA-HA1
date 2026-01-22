package com.ecommerce_backend.mapper;

import com.ecommerce_backend.dto.DetalleVentaResponseDTO;
import com.ecommerce_backend.dto.VentaResponseDTO;
import com.ecommerce_backend.model.DetalleVenta;
import com.ecommerce_backend.model.Venta;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class VentaMapper {

    private final ClienteMapper clienteMapper;
    private final ProductoMapper productoMapper;

    public VentaMapper(ClienteMapper clienteMapper, ProductoMapper productoMapper) {
        this.clienteMapper = clienteMapper;
        this.productoMapper = productoMapper;
    }

    public VentaResponseDTO toResponseDTO(Venta entity) {
        List<DetalleVentaResponseDTO> detallesDTO = entity.getDetalles().stream()
                .map(this::toDetalleResponseDTO)
                .collect(Collectors.toList());

        return VentaResponseDTO.builder()
                .idVenta(entity.getIdVenta())
                .cliente(clienteMapper.toResponseDTO(entity.getCliente()))
                .fechaVenta(entity.getFechaVenta())
                .total(entity.getTotal())
                .estado(entity.getEstado())
                .detalles(detallesDTO)
                .build();
    }

    private DetalleVentaResponseDTO toDetalleResponseDTO(DetalleVenta entity) {
        return DetalleVentaResponseDTO.builder()
                .idDetalle(entity.getIdDetalle())
                .producto(productoMapper.toResponseDTO(entity.getProducto()))
                .cantidad(entity.getCantidad())
                .precioUnitario(entity.getPrecioUnitario())
                .subtotal(entity.getSubtotal())
                .build();
    }

    public List<VentaResponseDTO> toResponseDTOList(List<Venta> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}