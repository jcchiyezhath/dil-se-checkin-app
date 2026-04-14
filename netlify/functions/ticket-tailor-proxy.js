exports.handler = async (event) => {
  const API_KEY = process.env.TICKET_TAILOR_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing API key' }),
    };
  }

  const encodedKey = Buffer.from(`${API_KEY}:`).toString('base64');

  const headers = {
    Authorization: `Basic ${encodedKey}`,
    Accept: 'application/json',
  };

  const query = event.queryStringParameters || {};
  const action = query.action;

  try {
    if (action === 'events') {
      const res = await fetch('https://api.tickettailor.com/v1/events', {
        headers,
      });

      const data = await res.json();

      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }

    if (action === 'search') {
      const eventId = query.event_id;
      const search = (query.q || '').toLowerCase();

      if (!eventId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Missing event_id' }),
        };
      }

      const url = new URL('https://api.tickettailor.com/v1/issued_tickets');
      url.searchParams.set('event_id', eventId);

      const res = await fetch(url.toString(), {
        headers,
      });

      const data = await res.json();
      const tickets = Array.isArray(data.data) ? data.data : [];

      const filtered = tickets.filter((t) => {
        const values = [
          t.reference,
          t.barcode,
          t?.customer_details?.name,
          t?.customer_details?.email,
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());

        return values.some((v) => v.includes(search));
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ data: filtered }),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid action' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server error',
        details: error.message,
      }),
    };
  }
};