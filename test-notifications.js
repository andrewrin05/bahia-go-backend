async function testNotifications() {
  try {
    console.log('🧪 Probando sistema de notificaciones...\n');

    // 1. Login para obtener token
    console.log('1️⃣ Iniciando sesión...');
    const loginResponse = await fetch('http://localhost:3001/auth/login-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@bahiago.com',
        password: 'Demo123!'
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Error en login:', loginResponse.status);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.access_token;
    console.log('✅ Login exitoso\n');

    // 2. Probar endpoint ping
    console.log('2️⃣ Probando endpoint ping...');
    const pingResponse = await fetch('http://localhost:3001/notifications/ping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const pingResult = await pingResponse.json();
    console.log('Resultado ping:', pingResult);
    console.log(pingResult.success ? '✅ Servicio funcionando' : '❌ Error en servicio', '\n');

    // 2.5 Intentar registrar un token de prueba (simulado)
    console.log('2.5️⃣ Registrando token de notificación de prueba...');
    const testToken = 'ExponentPushToken[test-token-123]'; // Token simulado para pruebas
    const tokenResponse = await fetch('http://localhost:3001/notifications/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ pushToken: testToken }),
    });

    const tokenResult = await tokenResponse.json();
    console.log('Resultado registro token:', tokenResult);
    console.log(tokenResult.success ? '✅ Token registrado' : '❌ Error registrando token', '\n');

    // 3. Enviar notificación de prueba
    console.log('3️⃣ Enviando notificación de prueba...');
    const testResponse = await fetch('http://localhost:8085/notifications/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const testResult = await testResponse.json();
    console.log('Resultado:', testResult);
    console.log(testResult.success ? '✅ Notificación enviada' : '❌ Error en notificación', '\n');

    // 4. Probar creación de reserva para ver notificación automática
    console.log('4️⃣ Creando reserva de prueba para activar notificación automática...');

    // Primero obtener boats disponibles
    const boatsResponse = await fetch('http://localhost:8085/boats');
    const boats = await boatsResponse.json();

    if (boats.length > 0) {
      const testBoat = boats[0];
      console.log(`Usando barco: ${testBoat.name}`);

      // Crear reserva
      const bookingResponse = await fetch('http://localhost:8085/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          boatId: testBoat.id,
          startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Mañana
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Pasado mañana
          totalPrice: testBoat.price,
        }),
      });

      const bookingResult = await bookingResponse.json();
      if (bookingResult.id) {
        console.log('✅ Reserva creada exitosamente');
        console.log('📋 Número de reserva:', bookingResult.bookingNumber);
        console.log('🔔 Deberías recibir una notificación de confirmación en la app\n');
      } else {
        console.log('❌ Error creando reserva:', bookingResult);
      }
    } else {
      console.log('❌ No hay barcos disponibles para prueba\n');
    }

    console.log('🎉 Pruebas completadas!');

  } catch (error) {
    console.error('❌ Error en pruebas:', error.message);
  }
}

testNotifications();