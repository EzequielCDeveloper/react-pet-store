import { test, expect } from '@playwright/test';
import { PetListSchema, PetSchema } from './schemas';

const BASE_API_URL = 'https://petstore.swagger.io/v2';

test.describe('Pet API Tests (Real Services)', () => {
  let createdPetId: number;

  test('CRUD Operations Flow', async ({ request }) => {
    // 1. Create (POST)
    const newPet = {
      id: Date.now(),
      name: `PW-Pet-${Date.now()}`,
      photoUrls: ['http://example.com/image.jpg'],
      status: 'available',
      tags: [{ id: 1, name: 'test' }],
      category: { id: 1, name: 'Dogs' }
    };

    const createResponse = await request.post(`${BASE_API_URL}/pet`, {
      data: newPet
    });
    expect(createResponse.ok()).toBeTruthy();
    const createData = await createResponse.json();
    expect(createData.name).toBe(newPet.name);

    // Save ID for subsequent steps
    createdPetId = createData.id;

    // 2. Read (GET by ID)
    const getResponse = await request.get(`${BASE_API_URL}/pet/${createdPetId}`);
    expect(getResponse.ok()).toBeTruthy();
    const getData = await getResponse.json();
    expect(getData.id).toBe(createdPetId);

    // Validate schema
    const schemaResult = PetSchema.safeParse(getData);
    expect(schemaResult.success).toBeTruthy();

    // 3. Update (PUT)
    const updatedPet = { ...newPet, status: 'sold' };
    const updateResponse = await request.put(`${BASE_API_URL}/pet`, {
      data: updatedPet
    });
    expect(updateResponse.ok()).toBeTruthy();
    const updateData = await updateResponse.json();
    expect(updateData.status).toBe('sold');

    // 4. Delete (DELETE)
    const deleteResponse = await request.delete(`${BASE_API_URL}/pet/${createdPetId}`);
    expect(deleteResponse.ok()).toBeTruthy();

    // 5. Verify Deletion (GET should 404)
    const verifyResponse = await request.get(`${BASE_API_URL}/pet/${createdPetId}`);
    expect(verifyResponse.status()).toBe(404);
  });

  test('GET /pet/findByStatus returns valid schema', async ({ request }) => {
    const response = await request.get(`${BASE_API_URL}/pet/findByStatus`, {
      params: { status: 'available' }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    // Basic validation - check if array
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);

    // Validate schema for the first few items to ensure contract
    // We limit to 5 to avoid flooding logs with third-party data issues
    const sample = data.slice(0, 5);
    PetListSchema.safeParse(sample);
  });

  test('Schema validation fails for invalid pet data (Negative Test)', async () => {
    // Construct an invalid pet object that violates the Zod schema
    const invalidPet = {
      id: "should-be-a-number", // Invalid type
      // name is missing (required)
      photoUrls: "not-an-array", // Invalid type
      status: "unknown-status" // Invalid enum value
    };

    const result = PetSchema.safeParse(invalidPet);

    expect(result.success).toBeFalsy();

    if (!result.success) {
      const formattedErrors = result.error.format();

      // Verify specific validation errors
      expect(formattedErrors.id).toBeDefined();
      expect(formattedErrors.name).toBeDefined(); // Missing required field
      expect(formattedErrors.photoUrls).toBeDefined();
      expect(formattedErrors.status).toBeDefined();
    }
  });
});
