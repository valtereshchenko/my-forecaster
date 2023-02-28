GET /products: to list all sales
GET /products/<id>: to get a specific sale by its ID
POST /products: to create a new sale recoed
PUT /prodcuts/<id>: to update a sale record by its ID
DELETE /products/<id>: to delete a sale record by its ID

# RUN THE BACKEND

-m uvicorn main:app --reload
