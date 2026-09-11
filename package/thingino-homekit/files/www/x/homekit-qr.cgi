#!/bin/sh
. /var/www/x/auth.sh
require_auth
code=${QUERY_STRING#setup_code=}; code=${code%%&*}; id=${QUERY_STRING#*&setup_id=}
case "$code:$id" in [0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9]:[A-Z0-9][A-Z0-9][A-Z0-9][A-Z0-9]) ;; *) printf 'Status: 400 Bad Request\n\n'; exit;; esac
pin=$(printf %s "$code" | tr -d -); value=$(( (2 << 31) + (17 << 28) + pin )); chars=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ; encoded=
while [ "$value" -gt 0 ]; do n=$((value % 36)); encoded=$(printf %s "$chars" | cut -c $((n + 1)))$encoded; value=$((value / 36)); done
while [ ${#encoded} -lt 9 ]; do encoded=0$encoded; done
printf 'Content-Type: image/svg+xml\nCache-Control: no-store\n\n'; qrencode -t SVG -o - "X-HM://$encoded$id"
