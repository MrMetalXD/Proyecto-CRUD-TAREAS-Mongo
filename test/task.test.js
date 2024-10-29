const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');
const jwt = require('jsonwebtoken');


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2NzIwNDU4MzJiMTdmM2FiZmIxMzg5ZDEiLCJlbWFpbCI6IlBhYmxvQGV4YW1wbGUuY29tIiwiaWF0IjoxNzMwMTcyNjY2LCJleHAiOjE3MzAxNzYyNjZ9.cJAsc3mqp1Rq7zp3L4EYDYJl4RW17p0G8EmC-yQPwvE";
let createdTaskId;

// Token expirado para probar error de autenticación
const expiredToken = jwt.sign({ uid: 'test-user' }, 'rodo1234', { expiresIn: '-1s' });

// Configuración inicial: crear una tarea para el resto de pruebas
before((done) => {
    request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .set('x-api-key', 'rodo1234')
        .send({
            title: 'Tarea de prueba inicial',
            description: 'Configuración para pruebas'
        })
        .end((err, res) => {
            if (err) return done(err);
            createdTaskId = res.body.id;
            done();
        });
});

// Prueba para crear una nueva tarea
describe('POST /tasks', () => {
    it('Debería crear una nueva tarea', (done) => {
        request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .set('x-api-key', 'rodo1234')
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

    it('No debería crear una tarea sin título', (done) => {
        request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .set('x-api-key', 'rodo1234')
            .send({
                description: 'Tarea sin título'
            })
            .expect(400) // Código 400 por falta de campo requerido
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'El título es requerido');
                done();
            });
    });
});

// Prueba para obtener todas las tareas del usuario
describe('GET /tasks', () => {
    it('Debería obtener todas las tareas del usuario', (done) => {
        request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .set('x-api-key', 'rodo1234')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.be.greaterThan(0);
                done();
            });
    });

    it('No debería permitir acceso con un token vencido', (done) => {
        request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${expiredToken}`)
            .set('x-api-key', 'rodo1234')
            .expect(403)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Token expirado');
                done();
            });
    });
});

// Prueba para actualizar una tarea
describe('PUT /tasks/:id', () => {
    it('Debería actualizar una tarea existente', (done) => {
        request(app)
            .put(`/tasks/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('x-api-key', 'rodo1234')
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

    it('No debería actualizar una tarea con ID inválido', (done) => {
        request(app)
            .put('/tasks/invalidTaskId')
            .set('Authorization', `Bearer ${token}`)
            .set('x-api-key', 'rodo1234')
            .send({
                title: 'Intento fallido de actualización'
            })
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Tarea no encontrada');
                done();
            });
    });
});

// Prueba para eliminar una tarea
describe('DELETE /tasks/:id', () => {
    it('Debería eliminar una tarea existente', (done) => {
        request(app)
            .delete(`/tasks/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('x-api-key', 'rodo1234')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Tarea eliminada correctamente');
                done();
            });
    });

    it('No debería eliminar una tarea con ID inválido', (done) => {
        request(app)
            .delete('/tasks/invalidTaskId')
            .set('Authorization', `Bearer ${token}`)
            .set('x-api-key', 'rodo1234')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('message', 'Tarea no encontrada');
                done();
            });
    });
});

// Limpieza final de las tareas creadas durante las pruebas
after((done) => {
    if (createdTaskId) {
        request(app)
            .delete(`/tasks/${createdTaskId}`)
            .set('Authorization', `Bearer ${token}`)
            .set('x-api-key', 'rodo1234')
            .end(done);
    } else {
        done();
    }
});
