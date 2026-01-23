package com.ecommerce_backend.service;

import com.ecommerce_backend.dto.ClienteRequestDTO;
import com.ecommerce_backend.dto.ClienteResponseDTO;
import java.util.List;

public interface ClienteService {
    ClienteResponseDTO crearCliente(ClienteRequestDTO dto);
    ClienteResponseDTO obtenerClientePorId(Long id);
    List<ClienteResponseDTO> obtenerTodosLosClientes();
    ClienteResponseDTO obtenerClientePorEmail(String email);
    ClienteResponseDTO actualizarCliente(Long id, ClienteRequestDTO dto);
    void eliminarCliente(Long id);
    List<ClienteResponseDTO> buscarClientesPorNombre(String nombre);
}