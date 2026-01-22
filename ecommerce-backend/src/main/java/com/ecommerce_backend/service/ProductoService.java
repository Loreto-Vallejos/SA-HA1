package com.ecommerce_backend.service;

import com.ecommerce_backend.dto.ProductoRequestDTO;
import com.ecommerce_backend.dto.ProductoResponseDTO;
import java.util.List;

public interface ProductoService {
    ProductoResponseDTO crearProducto(ProductoRequestDTO dto);
    ProductoResponseDTO obtenerProductoPorId(Long id);
    List<ProductoResponseDTO> obtenerTodosLosProductos();
    List<ProductoResponseDTO> obtenerProductosPorCategoria(String categoria);
    List<ProductoResponseDTO> obtenerProductosDisponibles();
    List<ProductoResponseDTO> buscarProductosPorNombre(String nombre);
    ProductoResponseDTO actualizarProducto(Long id, ProductoRequestDTO dto);
    void eliminarProducto(Long id);
    void actualizarStock(Long idProducto, Integer cantidad);
}