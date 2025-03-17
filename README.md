# API Documentation - UserController

This controller handles user-related operations using `UserService` and Prisma.

## Routes:

1. **POST /user**
   - Creates a new user.
   - **Parameters**: A `createUserDto` object in the body of the request, of type `Prisma.UserCreateInput`.

2. **GET /user**
   - Retrieves all users.
   - **Response**: An array of users.

3. **GET /user/:id**
   - Retrieves a specific user by their `id`.
   - **Parameter**: `id` in the URL, of type `string`.
   - **Response**: The user corresponding to the `id`.

4. **PATCH /user/:id**
   - Updates an existing user.
   - **Parameter**: `id` in the URL, of type `string`.
   - **Request Body**: A `updateUserDto` object of type `Prisma.UserUpdateInput`.

5. **DELETE /user/:id**
   - Deletes a user by their `id`.
   - **Parameter**: `id` in the URL, of type `string`.
   - **Response**: Confirmation of deletion.

## Example Usage:

- **Create a user**:  
   Send a `POST` request with a JSON object in the body (e.g., name, email, etc.).

- **Get all users**:  
   Send a `GET` request to `/user`.

- **Update a user**:  
   Send a `PATCH` request with the user's `id` and the data to be updated.

## Installation

To use this API, ensure that you have installed the necessary dependencies:

1. Install NestJS and Prisma:
    ```bash
    npm install @nestjs/common @nestjs/core @nestjs/platform-express prisma
    ```

2. Set up the Prisma database models and migrate:
    ```bash
    npx prisma db push
    ```

3. Start the application:
    ```bash
    npm run start
    ```

Now, your API should be ready to handle user management with the `UserController`.
"# WasteManagementBackend" 
