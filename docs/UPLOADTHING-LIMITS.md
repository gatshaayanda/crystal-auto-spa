# Crystal Auto Spa — UploadThing limits

Crystal Auto Spa uses UploadThing for service media, staff gallery uploads and customer ride-photo/video submissions. Firebase Storage is not used.

The current UploadThing router accepts one file per upload:
- **Images:** up to 4 MB
- **Videos:** up to 16 MB
- **PDFs:** up to 4 MB

These are the repository's endpoint limits, not a guarantee about the connected UploadThing account's plan or network throughput. Client validation should match the router. Staff uploads require a verified staff session. Customer ride media requires a valid, unexpired receipt token and explicit consent; submissions remain pending moderation until staff approves them.

Uploads require an internet connection. A selected file or completed storage upload alone is not a saved gallery item or a public post: the corresponding Firestore metadata write must also succeed. If an upload stalls or is rejected, check `UPLOADTHING_TOKEN`, UploadThing endpoint logs, network connectivity and the provider's current plan/settings. Do not add Firebase Storage or storage rules as a workaround.
