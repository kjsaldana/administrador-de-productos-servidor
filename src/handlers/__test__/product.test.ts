import request from 'supertest'
import server from '../../server'

describe('POST /api/products', () => {
    it('Should display validation errors', async () => {
        const response = await request(server).post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
    })

    it('Should validate if price is greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Monitor - Testing",
            price: 0
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(404)
    })

    it('Should validate if price is a number and greater than 0', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Monitor - Testing",
            price: "hola"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
    })

    it('Should create a new product', async () => {
        const response = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 50
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products', () => {
    it('Should check if /api/products url exists', async () => {
        const response = await request(server).get('/api/products')
        
        expect(response.status).not.toBe(404)
    })

    it('Should get a JSON response with products', async () => {
        const response = await request(server).get('/api/products')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body.data).toHaveLength(1)

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
        
    })
})

describe('GET /api/products/:id', () => {
    it('Should return 404 for a non-existent product', async () => {
        const productID = 2000
        const response = await request(server).get(`/api/products/${productID}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should check a valid Id in the URL', async () => {
        const response = await request(server).get('/api/products/not-valid-id')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id no válido')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should get a JSON response for a single product', async () => {
        const response = await request(server).get('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/product/:id', () => {    
    it('Should check if /api/products/:id url exists', async () => {
        const response = await request(server).put('/api/products/not-valid-id').send({
                name: "Producto 1 - actualizado",
                availability: true,
                price: 300
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no válido')
    })

    it('Should display a validation error when try to update a product, empty', async () => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should validate that the price is greater than 0', async () => {
        const response = await request(server).put('/api/products/1').send({
                name: "Producto 1 - actualizado",
                availability: true,
                price: 0
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors[0].msg).toBe('Tiene que ser mayor a 0')
        expect(response.body.errors).toHaveLength(1)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should validate if the product exists', async () => {
        const productID = 2000
        const response = await request(server).put(`/api/products/${productID}`).send({
                name: "Producto 1 - actualizado",
                availability: true,
                price: 300
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    
    it('Should update an existing product with valid data', async () => {
        const productID = 1
        const response = await request(server).put(`/api/products/${productID}`).send({
                name: "Producto 1 - actualizado",
                availability: true,
                price: 300
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        
        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(400)
    })
})

describe('PATCH /api/product/:id', () => {
    it('Should validate if the product exists', async () => {
        const productID = 2000
        const response = await request(server).patch(`/api/products/${productID}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    
    it('Should update an existing product availability', async () => {
        const response = await request(server).patch('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        
        expect(response.body).not.toHaveProperty('errors')
        expect(response.status).not.toBe(400)
    })
})

describe('DELETE /api/product/:id', () => {
    it('Should check a valid ID', async () => {
        const result = await request(server).delete('/api/products/no-valid-id')

        expect(result.status).toBe(400)
        expect(result.body).toHaveProperty('errors')
        expect(result.body.errors[0].msg).toBe('Id no válido')
        
        expect(result.status).not.toBe(200)
        expect(result.body).not.toHaveProperty('data')
    })
    it('Should return a 404 response for non-existent product', async () => {
        const productID = 2000
        const result = await request(server).delete(`/api/products/${productID}`)

        expect(result.status).toBe(404)
        expect(result.body.error).toBe('Producto no encontrado')
        
        expect(result.status).not.toBe(200)
        expect(result.body).not.toHaveProperty('data')
    })
    it('Should delete a product', async () => {
        const result = await request(server).delete('/api/products/1')

        expect(result.status).toBe(200)
        expect(result.body).toHaveProperty('data')
        expect(result.body.data).toBe('Producto Eliminado')
        
        expect(result.status).not.toBe(400)
        expect(result.body).not.toHaveProperty('errors')

    })
})

