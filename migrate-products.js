// Migration script: catalogo.json -> Backend API
const fs = require('fs');
const path = require('path');

const CATALOGO_PATH = path.join(__dirname, 'catalogo.json');
const API_URL = 'http://localhost:8080/api/products';

async function migrate() {
    const data = JSON.parse(fs.readFileSync(CATALOGO_PATH, 'utf-8'));

    for (const item of data) {
        const product = {
            name: item.nombre,
            price: item.precio,
            precioAnterior: item.precioAnterior || null,
            descuento: item.descuento || null,
            badgeColor: item.badgeColor || null,
            image: item.imagen,
            description: item.descripcion,
            category: null,
            galeria: item.galeria || [],
            detalles: item.detalles || {},
            especificaciones_tecnicas: item.especificaciones_tecnicas || {},
            servicios: item.servicios || {},
            opciones: (item.opciones || []).map(opt => ({
                name: opt.nombre,
                values: opt.valores
            }))
        };

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (res.ok) {
                const saved = await res.json();
                console.log(`Migrated: ${saved.name} (ID: ${saved.id})`);
            } else {
                console.error(`Failed: ${item.nombre} - ${res.status}`);
            }
        } catch (err) {
            console.error(`Error: ${item.nombre}`, err.message);
        }
    }

    console.log('\nMigration complete!');
}

migrate();
