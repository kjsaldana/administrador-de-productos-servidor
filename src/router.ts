import { Router } from 'express'
import { createProduct, getProducts, getProductById, updateProduct, updateAvailability, deleteProduct } from './handlers/product'
import { body, param } from 'express-validator'
import { handleInputErrors } from './middleware'

const router = Router()

/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The product ID
 *                  example: 1
 *              name:
 *                  type: string
 *                  description: The product name
 *                  example: 'Monitor curvo 49 pulgadas'
 *              price:
 *                  type: number
 *                  description: The product price
 *                  example: 300
 *              availability:
 *                  type: boolean
 *                  description: The product availability
 *                  example: true
 */

/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Get a list of products
 *      tags:
 *          - Products
 *      description: Return a list of products
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 */

router.get('/',
    getProducts
)

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request
 *          404:
 *              description: Product not found
 * 
 */

router.get('/:id',
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    getProductById
)

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Products
 *      description: Return a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: 'Monitor Curvo 49 pulgadas'
 *                          price:
 *                              type: number
 *                              expample: 300
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          400:
 *              description: Bad request, invalid input data
 */

router.post('/',
    body('name')
        .notEmpty().withMessage('No puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('No puede ir vacio')
        .custom(value => value > 0).withMessage('Tiene que ser mayor a 0'),
    handleInputErrors,
    createProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: 'Monitor Curvo 49 pulgadas'
 *                          price:
 *                              type: number
 *                              expample: 300
 *                          acailability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 * 
 *          400:
 *              description: Bad Request - Invalid ID or invalid input data
 *          404:
 *              description: Product not found
 */

router.put('/:id',
    param('id').isInt().withMessage('Id no válido'),
    body('name')
        .notEmpty().withMessage('No puede ir vacio'),
    body('price')
        .isNumeric().withMessage('Valor no valido')
        .notEmpty().withMessage('No puede ir vacio')
        .custom(value => value > 0).withMessage('Tiene que ser mayor a 0'),
    body('availability')
        .isBoolean().withMessage('Valor no valido'),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update product availability
 *      tags:
 *          - Products
 *      description: Returns the updated availability
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 * 
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not found
 */

router.patch('/:id', 
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a product by ID
 *      tags:
 *          - Products
 *      description: Returns the confirmation message
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Removed Successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: "Producto Eliminado"
 *          400:
 *              description: Bad Request - Invalid ID
 *          404:
 *              description: Product not found
 */

router.delete('/:id',
    param('id').isInt().withMessage('Id no válido'),
    handleInputErrors,
    deleteProduct
)

export default router