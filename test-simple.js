async function testSimpleEndpoint() {
  try {
    console.log('Testing simple endpoint...');
    const response = await fetch('http://localhost:8085/auth/request-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const result = await response.json();
    console.log('Response:', result);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSimpleEndpoint();