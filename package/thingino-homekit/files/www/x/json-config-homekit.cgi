#!/bin/sh
. /var/www/x/auth.sh
require_auth
CONF=/etc/go2rtc-homekit.yaml
state() { wget -qO- http://127.0.0.1:1984/api/homekit?id=homekit; }
reply() { printf 'Content-Type: application/json\nCache-Control: no-store\n\n%s\n' "$1"; exit; }
case "$REQUEST_METHOD" in
GET|"") value=$(state); [ -n "$value" ] && reply "$value" || reply '{"error":{"message":"HomeKit service unavailable"}}' ;;
POST) request=$(dd bs=1 count="$CONTENT_LENGTH" 2>/dev/null); case "$request" in *'"action":"reset"'*) pin=$(od -An -N4 -tu4 /dev/urandom | tr -d ' '); pin=$((pin % 90000000 + 10000000)); formatted=$(printf '%08d' "$pin" | sed 's/\(...\)\(..\)\(...\)/\1-\2-\3/'); sed -i '/^[[:space:]]*pairings:/,/^[^[:space:]]/d;s/^[[:space:]]*pin:.*/    pin: "'$formatted'"/' "$CONF"; /etc/init.d/S97go2rtc restart >/dev/null 2>&1; sleep 1; value=$(state); [ -n "$value" ] && reply "$value" || reply '{"error":{"message":"HomeKit restart failed"}}' ;; *) reply '{"error":{"message":"Invalid action"}}' ;; esac ;;
*) reply '{"error":{"message":"Method not allowed"}}' ;; esac
