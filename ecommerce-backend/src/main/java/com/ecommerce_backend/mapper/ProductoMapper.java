package com.ecommerce_backend.mapper;

import com.ecommerce_backend.dto.ProductoRequestDTO;
import com.ecommerce_backend.dto.ProductoResponseDTO;
import com.ecommerce_backend.model.Producto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductoMapper {

    public Producto toEntity(ProductoRequestDTO dto) {
        Producto producto = new Producto();
        producto.setNombre(dto.getNombre());
        producto.setCategoria(dto.getCategoria());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setPrecioAnterior(dto.getPrecioAnterior());
        producto.setDescuento(dto.getDescuento());
        producto.setBadgeColor(dto.getBadgeColor());
        producto.setImagen(dto.getImagen());
        producto.setDetalles(dto.getDetalles());
        producto.setStock(dto.getStock() != null ? dto.getStock() : 0);
        return producto;
    }

    public ProductoResponseDTO toResponseDTO(Producto entity) {
        return ProductoResponseDTO.builder()
                .idProducto(entity.getIdProducto())
                .nombre(entity.getNombre())
                .categoria(entity.getCategoria())
                .descripcion(entity.getDescripcion())
                .precio(entity.getPrecio())
                .precioAnterior(entity.getPrecioAnterior())
                .descuento(entity.getDescuento())
                .badgeColor(entity.getBadgeColor())
                .imagen(entity.getImagen())
                .detalles(entity.getDetalles())
                .stock(entity.getStock())
                .estadoStock(entity.getEstadoStock())
                .disponible(entity.isDisponible())
                .build();
    }

    public List<ProductoResponseDTO> toResponseDTOList(List<Producto> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void updateEntityFromDTO(Producto entity, ProductoRequestDTO dto) {
        entity.setNombre(dto.getNombre());
        entity.setCategoria(dto.getCategoria());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPrecio(dto.getPrecio());
        entity.setPrecioAnterior(dto.getPrecioAnterior());
        entity.setDescuento(dto.getDescuento());
        entity.setBadgeColor(dto.getBadgeColor());
        entity.setImagen(dto.getImagen());
        entity.setDetalles(dto.getDetalles());
        if (dto.getStock() != null) {
            entity.setStock(dto.getStock());
        }
    }
}