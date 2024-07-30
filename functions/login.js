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

    // Connect to SAP HANA
    const conn = hana.createConnection();

    const connectToHana = () => {
      return new Promise((resolve, reject) => {
        conn.connect(connParams, (err) => {
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

