#!/bin/sh
. /var/www/x/auth.sh
require_auth

PAIRING_DIR=/etc/homekit

send_json() {
	printf 'Status: %s\nContent-Type: application/json\nCache-Control: no-store\nPragma: no-cache\nConnection: close\n\n%s\n' "${2:-200 OK}" "$1"
	exit 0
}

status_json() {
	if [ -d "$PAIRING_DIR" ] && [ -n "$(find "$PAIRING_DIR" -mindepth 1 -maxdepth 1 -print -quit 2>/dev/null)" ]; then
		printf '{"paired":true}'
	else
		printf '{"paired":false}'
	fi
}

case "$REQUEST_METHOD" in
	GET | "") send_json "$(status_json)" ;;
	POST)
		[ "$CONTENT_LENGTH" -gt 0 ] 2>/dev/null || send_json '{"error":{"message":"Invalid request"}}' '400 Bad Request'
		request=$(dd bs=1 count="$CONTENT_LENGTH" 2>/dev/null)
		case "$request" in
			*'"action":"reset"'* | *'"action" : "reset"'*)
				if [ -d "$PAIRING_DIR" ]; then
					find "$PAIRING_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} \;
				fi
				if [ -x /etc/init.d/S97homekitd ]; then
					/etc/init.d/S97homekitd restart >/dev/null 2>&1
				fi
				send_json "$(status_json)"
				;;
			*) send_json '{"error":{"message":"Invalid HomeKit action"}}' '422 Unprocessable Entity' ;;
		esac
		;;
	*) send_json '{"error":{"message":"Method not allowed"}}' '405 Method Not Allowed' ;;
esac
