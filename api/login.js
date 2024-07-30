const hana = require('@sap/hana-client');

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const conn = hana.createConnection();

  try {
    const data = req.body;

    const connParams = {
      database: data.database,
      host: data.server,
      port: data.port,
      user: data.uid,
      password: data.pwd,
      sslValidateCertificate: 'false',
    };

    conn.connect(connParams);

    await connectToHana();

    return res.status(200).json({ message: 'Successfully connected to SAP HANA!' });
  } catch (error) {
    return res.status(500).json({ error: 'Connection error. Please check your credentials.', details: error.message });
  } finally {
    conn.disconnect();
  }
};

