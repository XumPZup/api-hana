const hana = require('@sap/hana-client');

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const connParams = {
      serverNode: data.server + ":" + data.port,
      uid: data.uid,
      pwd: data.pwd,
    };

    const conn = hana.createConnection();

    const connectToHana = () => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          conn.disconnect();
          reject(new Error('Connection attempt timed out'));
        }, 9000); // Timeout slightly less than Netlify's 10s limit

        conn.connect(connParams, (err) => {
          clearTimeout(timeout);
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    await connectToHana();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully connected to SAP HANA!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Connection error. Please check your credentials.', details: error.message }),
    };
  } finally {
    conn.disconnect();
  }
};

