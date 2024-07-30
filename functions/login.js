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
        serverNode: data.server+ ":" + data.port,
        uid: data.uid,
        pwd: data.pwd,
    };

    // Connect to SAP HANA
    const conn = hana.createConnection();
    conn.connect(connParams, err => {
      if (err) {
	return {
	  statusCode: 500,
          body: JSON.stringify({ error: 'Connection error. Please check your credentials. '}),
	}
      } else {
	return {
	  statusCode: 200,
          body: JSON.stringify({ message: 'Successfully connected to SAP HANA!' }),
	}
      }
      conn.disconnect();
    });
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body", error }),
    };
  };
};
