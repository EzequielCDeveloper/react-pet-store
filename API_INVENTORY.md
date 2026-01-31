# API Inventory

## 1. General Info
- **Host**: petstore.swagger.io
- **BasePath**: /v2
- **Schemes**: https, http
- **Consumes**: N/A
- **Produces**: N/A

## 2. Tags
- **pet**: Everything about your Pets
- **store**: Access to Petstore orders
- **user**: Operations about user

## 3. Endpoints
- `POST /pet/{petId}/uploadImage` (OperationId: `uploadFile`)
  - Tags: pet
  - Summary: uploads an image
- `POST /pet` (OperationId: `addPet`)
  - Tags: pet
  - Summary: Add a new pet to the store
- `PUT /pet` (OperationId: `updatePet`)
  - Tags: pet
  - Summary: Update an existing pet
- `GET /pet/findByStatus` (OperationId: `findPetsByStatus`)
  - Tags: pet
  - Summary: Finds Pets by status
- `GET /pet/findByTags` (OperationId: `findPetsByTags`)
  - Tags: pet
  - Summary: Finds Pets by tags
- `GET /pet/{petId}` (OperationId: `getPetById`)
  - Tags: pet
  - Summary: Find pet by ID
- `POST /pet/{petId}` (OperationId: `updatePetWithForm`)
  - Tags: pet
  - Summary: Updates a pet in the store with form data
- `DELETE /pet/{petId}` (OperationId: `deletePet`)
  - Tags: pet
  - Summary: Deletes a pet
- `GET /store/inventory` (OperationId: `getInventory`)
  - Tags: store
  - Summary: Returns pet inventories by status
- `POST /store/order` (OperationId: `placeOrder`)
  - Tags: store
  - Summary: Place an order for a pet
- `GET /store/order/{orderId}` (OperationId: `getOrderById`)
  - Tags: store
  - Summary: Find purchase order by ID
- `DELETE /store/order/{orderId}` (OperationId: `deleteOrder`)
  - Tags: store
  - Summary: Delete purchase order by ID
- `POST /user/createWithList` (OperationId: `createUsersWithListInput`)
  - Tags: user
  - Summary: Creates list of users with given input array
- `GET /user/{username}` (OperationId: `getUserByName`)
  - Tags: user
  - Summary: Get user by user name
- `PUT /user/{username}` (OperationId: `updateUser`)
  - Tags: user
  - Summary: Updated user
- `DELETE /user/{username}` (OperationId: `deleteUser`)
  - Tags: user
  - Summary: Delete user
- `GET /user/login` (OperationId: `loginUser`)
  - Tags: user
  - Summary: Logs user into the system
- `GET /user/logout` (OperationId: `logoutUser`)
  - Tags: user
  - Summary: Logs out current logged in user session
- `POST /user/createWithArray` (OperationId: `createUsersWithArrayInput`)
  - Tags: user
  - Summary: Creates list of users with given input array
- `POST /user` (OperationId: `createUser`)
  - Tags: user
  - Summary: Create user

## 4. Models
- **ApiResponse**
- **Category**
- **Pet**
- **Tag**
- **Order**
- **User**

## 5. Security Definitions
- **api_key** (apiKey)
  - In: header, Name: api_key
- **petstore_auth** (oauth2)
  - Auth URL: https://petstore.swagger.io/oauth/authorize
  - Flow: implicit
