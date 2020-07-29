openssl genrsa 1024 > ssl/ssl.key
openssl req -x509 -new -key ssl/ssl.key > ssl/ssl.crt