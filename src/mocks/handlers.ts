import { http, HttpResponse } from 'msw';

export const handlers = [
  // Pets
  http.get('*/pet/findByStatus', () => {
    return HttpResponse.json([
      { id: 1, name: 'Doggie', status: 'available', photoUrls: [] },
      { id: 2, name: 'Kitty', status: 'pending', photoUrls: [] }
    ]);
  }),
  
  http.get('*/pet/:petId', ({ params }) => {
    const { petId } = params;
    if (petId === '999') {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ 
      id: Number(petId), 
      name: 'Doggie', 
      status: 'available', 
      photoUrls: [] 
    });
  }),

  http.post('*/pet', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  http.put('*/pet', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body);
  }),

  http.delete('*/pet/:petId', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Store
  http.get('*/store/inventory', () => {
    return HttpResponse.json({
      available: 10,
      pending: 5,
      sold: 2
    });
  }),

  http.post('*/store/order', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      id: 123,
      ...body as object,
      status: 'placed',
      complete: false
    });
  }),

  http.get('*/store/order/:orderId', ({ params }) => {
    const { orderId } = params;
    return HttpResponse.json({
      id: Number(orderId),
      petId: 1,
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: false
    });
  }),

  http.delete('*/store/order/:orderId', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // Users
  http.get('*/user/login', () => {
    return new HttpResponse("Logged in user session: 12345", { status: 200 });
  }),

  http.get('*/user/logout', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  http.post('*/user', async () => {
    return HttpResponse.json({ code: 200, type: "unknown", message: "123" });
  }),
  
  http.post('*/user/createWithArray', async () => {
    return HttpResponse.json({ code: 200, type: "unknown", message: "ok" });
  }),
  
  http.post('*/user/createWithList', async () => {
    return HttpResponse.json({ code: 200, type: "unknown", message: "ok" });
  }),

  http.get('*/user/:username', ({ params }) => {
    const { username } = params;
    if (username === 'unknown') {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      id: 1,
      username: username,
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password",
      phone: "123",
      userStatus: 1
    });
  }),

  http.put('*/user/:username', async () => {
    return HttpResponse.json({ code: 200, type: "unknown", message: "123" });
  }),

  http.delete('*/user/:username', () => {
    return HttpResponse.json({ code: 200, type: "unknown", message: "123" });
  }),
];
