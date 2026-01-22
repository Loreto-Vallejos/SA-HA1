package com.ecommerce_backend.mapper;

import com.ecommerce_backend.dto.ClienteRequestDTO;
import com.ecommerce_backend.dto.ClienteResponseDTO;
import com.ecommerce_backend.model.Cliente;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClienteMapper {

    public Cliente toEntity(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setApellido(dto.getApellido());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefono(dto.getTelefono());
        cliente.setDireccion(dto.getDireccion());
        cliente.setCiudad(dto.getCiudad());
        return cliente;
    }

    public ClienteResponseDTO toResponseDTO(Cliente entity) {
        return ClienteResponseDTO.builder()
                .idCliente(entity.getIdCliente())
                .nombre(entity.getNombre())
                .apellido(entity.getApellido())
                .email(entity.getEmail())
                .telefono(entity.getTelefono())
                .direccion(entity.getDireccion())
                .ciudad(entity.getCiudad())
                .fechaRegistro(entity.getFechaRegistro())
                .build();
    }

    public List<ClienteResponseDTO> toResponseDTOList(List<Cliente> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void updateEntityFromDTO(Cliente entity, ClienteRequestDTO dto) {
        entity.setNombre(dto.getNombre());
        entity.setApellido(dto.getApellido());
        entity.setEmail(dto.getEmail());
        entity.setTelefono(dto.getTelefono());
        entity.setDireccion(dto.getDireccion());
        entity.setCiudad(dto.getCiudad());
    }
}