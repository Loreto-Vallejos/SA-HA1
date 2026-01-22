package com.ecommerce_backend.service.impl;

import com.ecommerce_backend.dto.ClienteRequestDTO;
import com.ecommerce_backend.dto.ClienteResponseDTO;
import com.ecommerce_backend.exception.DuplicateResourceException;
import com.ecommerce_backend.exception.ResourceNotFoundException;
import com.ecommerce_backend.mapper.ClienteMapper;
import com.ecommerce_backend.model.Cliente;
import com.ecommerce_backend.repository.ClienteRepository;
import com.ecommerce_backend.service.ClienteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    @Override
    public ClienteResponseDTO crearCliente(ClienteRequestDTO dto) {
        log.info("Creando nuevo cliente con email: {}", dto.getEmail());

        if (clienteRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Ya existe un cliente con el email: " + dto.getEmail());
        }

        Cliente cliente = clienteMapper.toEntity(dto);
        Cliente clienteGuardado = clienteRepository.save(cliente);

        log.info("Cliente creado exitosamente con ID: {}", clienteGuardado.getIdCliente());
        return clienteMapper.toResponseDTO(clienteGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponseDTO obtenerClientePorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));
        return clienteMapper.toResponseDTO(cliente);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> obtenerTodosLosClientes() {
        List<Cliente> clientes = clienteRepository.findAll();
        return clienteMapper.toResponseDTOList(clientes);
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponseDTO obtenerClientePorEmail(String email) {
        Cliente cliente = clienteRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con email: " + email));
        return clienteMapper.toResponseDTO(cliente);
    }

    @Override
    public ClienteResponseDTO actualizarCliente(Long id, ClienteRequestDTO dto) {
        log.info("Actualizando cliente ID: {}", id);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con ID: " + id));

        if (!cliente.getEmail().equals(dto.getEmail()) && clienteRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("El email ya está en uso por otro cliente");
        }

        clienteMapper.updateEntityFromDTO(cliente, dto);
        Cliente clienteActualizado = clienteRepository.save(cliente);

        return clienteMapper.toResponseDTO(clienteActualizado);
    }

    @Override
    public void eliminarCliente(Long id) {
        log.info("Eliminando cliente ID: {}", id);

        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente no encontrado con ID: " + id);
        }

        clienteRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> buscarClientesPorNombre(String nombre) {
        List<Cliente> clientes = clienteRepository.findByNombreContainingIgnoreCase(nombre);
        return clienteMapper.toResponseDTOList(clientes);
    }
}