const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

// Este es el token que obtuviste en la sesión iniciada
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBd0dSVFM1STdwU0hMV1k4ZXhQZVNGZmZPbkMzIiwiZW1haWwiOiJyb2RvQGV4YW1wbGUuY29tIiwiaWF0IjoxNzI5NjQ3NzM5LCJleHAiOjE3Mjk2NTEzMzl9.3vF_AegzUHInWd7EDYJ6mwY9iOP9LAaQFTkBI0kDUdA";

let createdTaskId;

// Prueba para crear una nueva tarea
describe('POST /tasks', () => {
    it('Debería crear una nueva tarea', (done) => {
        request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)  // Aquí añadimos el token de autenticación
            .set('x-api-key', 'rodo1234')  // Agregar la API Key si es necesario
            .send({
                title: 'Tarea de prueba',
                description: 'Esta es una tarea de prueba'
            })
            .expect(201)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('id');
                expect(res.body.title).to.equal('Tarea de prueba');
                createdTaskId = res.body.id; // Guardamos el ID de la tarea creada para otras pruebas
                done();
            });
    });
});

// Prueba para obtener todas las tareas del usuario
describe('GET /tasks', () => {
    it('Debería obtener todas las tareas del usuario', (done) => {
        request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`)  // Aquí añadimos el token de autenticación
            .set('x-api-key', 'rodo1234')  // Agregar la API Key si es necesario
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.greaterThan(0);
                done();
            });
    });
});

// Prueba para actualizar una tarea
describe('PUT /tasks/:id', () => {
    it('Debería actualizar una tarea existente', (done) => {
        request(app)
            .put(`/tasks/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`)  // Aquí añadimos el token de autenticación
            .set('x-api-key', 'rodo1234')  // Agregar la API Key si es necesario
            .send({
                title: 'Tarea actualizada',
                description: 'Descripción actualizada',
                completed: true
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.title).to.equal('Tarea actualizada');
                expect(res.body.completed).to.equal(true);
                done();
            });
    });
});

// Prueba para eliminar una tarea
describe('DELETE /tasks/:id', () => {
    it('Debería eliminar una tarea existente', (done) => {
        request(app)
            .delete(`/tasks/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`)  // Aquí añadimos el token de autenticación
            .set('x-api-key', 'rodo1234')  // Agregar la API Key si es necesario
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Tarea eliminada correctamente');
                done();
            });
    });
});
